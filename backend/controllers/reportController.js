const ExcelJS = require("exceljs");
const Registration = require("../models/Registration");
const Elective = require("../models/Elective");

// Export one file per elective
exports.exportPerElective = async (req, res) => {
    try {
        const electives = await Elective.find();

        for (let elective of electives) {
            const regs = await Registration.find({ elective: elective._id }).populate("student");

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet(elective.name);

            sheet.columns = [
                { header: "Roll No", key: "rollNo", width: 15 },
                { header: "Name", key: "name", width: 25 },
                { header: "Semester", key: "semester", width: 10 },
                { header: "Odd/Even", key: "oddEven", width: 10 },
            ];

            regs.forEach(r => {
                sheet.addRow({
                    rollNo: r.student.rollNo,
                    name: r.student.name,
                    semester: r.student.semester,
                    oddEven: r.student.oddEven
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader("Content-Disposition", `attachment; filename=${elective.code}.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            return res.send(buffer);
        }
    } catch (err) {
        res.status(500).json({ msg: "Error generating report", error: err.message });
    }
};

// Export one Excel file with multiple sheets
exports.exportMultiSheet = async (req, res) => {
    try {
        const electives = await Elective.find();
        const workbook = new ExcelJS.Workbook();

        for (let elective of electives) {
            const regs = await Registration.find({ elective: elective._id }).populate("student");
            const sheet = workbook.addWorksheet(elective.name);

            sheet.columns = [
                { header: "Roll No", key: "rollNo", width: 15 },
                { header: "Name", key: "name", width: 25 },
                { header: "Semester", key: "semester", width: 10 },
                { header: "Odd/Even", key: "oddEven", width: 10 },
            ];

            regs.forEach(r => {
                sheet.addRow({
                    rollNo: r.student.rollNo,
                    name: r.student.name,
                    semester: r.student.semester,
                    oddEven: r.student.oddEven
                });
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Disposition", "attachment; filename=all_electives.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (err) {
        res.status(500).json({ msg: "Error generating report", error: err.message });
    }
};

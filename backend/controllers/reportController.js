const ExcelJS = require("exceljs");
const Registration = require("../models/Registration");
const Elective = require("../models/Elective");

// Export one file per elective
exports.exportPerElective = async (req, res) => {
    try {
        const { electiveId } = req.query;

        if (!electiveId) {
            return res.status(400).json({ msg: "Elective ID is required" });
        }

        const elective = await Elective.findById(electiveId);
        if (!elective) {
            return res.status(404).json({ msg: "Elective not found" });
        }

        const regs = await Registration.find({ elective: electiveId }).populate("student");

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
        res.setHeader("Content-Disposition", `attachment; filename=${elective.code}_enrollments.xlsx`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (err) {
        res.status(500).json({ msg: "Error generating report", error: err.message });
    }
};

// Export one Excel file with multiple sheets
exports.exportMultiSheet = async (req, res) => {
    try {
        const electives = await Elective.find().sort({ semester: 1, name: 1 });
        const workbook = new ExcelJS.Workbook();

        // Add summary sheet
        const summarySheet = workbook.addWorksheet("Summary");
        summarySheet.columns = [
            { header: "Elective Code", key: "code", width: 15 },
            { header: "Elective Name", key: "name", width: 30 },
            { header: "Semester", key: "semester", width: 10 },
            { header: "Type", key: "type", width: 10 },
            { header: "Enrollments", key: "enrollments", width: 12 },
        ];

        for (let elective of electives) {
            const regs = await Registration.find({ elective: elective._id }).populate("student");
            const sheet = workbook.addWorksheet(`${elective.code}`);

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

            // Add to summary
            summarySheet.addRow({
                code: elective.code,
                name: elective.name,
                semester: elective.semester,
                type: elective.oddEven,
                enrollments: regs.length
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Disposition", "attachment; filename=all_electives_report.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (err) {
        res.status(500).json({ msg: "Error generating report", error: err.message });
    }
};

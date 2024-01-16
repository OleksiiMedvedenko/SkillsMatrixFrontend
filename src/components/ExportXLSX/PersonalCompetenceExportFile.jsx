import * as React from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/material";
import formatDate from "../../service/dateUtils";

const PersonalCompetenceExportFile = ({data, employeeData}) => {
    //styles 
    const getFont = ({ name = 'Calibri', size = 11, bold = false}) => {
        const font = {
            name,
            size,
            bold
        };
        return font;
    };

    const getAlignment = ({vertical = 'middle', horizontal ='center', textRotation = 0,  wrapText = false}) => {
        const alignment = {
            vertical,
            horizontal,
            textRotation,
            wrapText
        }
        return alignment;
    }

    const getBorder = ({top = { style: 'thin' }, left = { style: 'thin' },
                        bottom = { style: 'thin' }, right = { style: 'thin' }}) => {
        const border = {
          top,
          left,
          bottom,
          right
        };
        return border;
    };

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('kompetencje dla pracownika');

        const placeAndDateRow = worksheet.addRow(['', 'Siemianice,' + '  ' + `${formatDate(new Date())}`]);
        placeAndDateRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = getAlignment({});
            cell.font = getFont({});
        });
        
        for(let i = 0; i <= 2; i++){
            worksheet.addRow([]);
        }

//start document Header:
        const row1 = worksheet.addRow(['', 'Wydruk kompetencji dla:']);
        row1.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = getAlignment({});;
            cell.font = getFont({});
        });
        const row2 = worksheet.addRow(['', `${employeeData?.Employee?.FullName}`]);
        row2.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = getAlignment({});;
            cell.font = getFont({size: 18});
        });        
        const row3 = worksheet.addRow(['', 'Na stanowisku:']);
        row3.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = getAlignment({});;
            cell.font = getFont({});
        });
        const row4 = worksheet.addRow(['', `${employeeData?.Position?.Name}`]);
        row4.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = getAlignment({});;
            cell.font = getFont({name: 'Georgia', size: 14});
        });
        const row5 = worksheet.addRow(['', 'Przelozony: ' + `${employeeData?.Supervisor?.FullName ?? '-'}`]);
        row5.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = getAlignment({});
            cell.font = getFont({});
        });
//end document Header:

//table 
//table header
        const tableHeader = worksheet.addRow(['Obszar', 'Nazwa Stanowiska', 'Posiadany poziom kompetencji', 'Data następnego audyty (jesli wymagane)']);
        const tableHeaderCellCount = tableHeader.actualCellCount;
        tableHeader.eachCell({includeEmpty: true}, (cell, colNumber) => {
            cell.alignment = getAlignment({ textRotation: 90, wrapText: true});
            cell.font = getFont({size: 12});
            cell.border = getBorder({top:{style: 'medium'}, bottom:{style: 'medium'}});

            if(colNumber === 1) {
                cell.border = getBorder({left: {style: 'medium'}, top:{style: 'medium'}, bottom:{style: 'medium'}});
            }
            if(colNumber === tableHeaderCellCount) {
                cell.border = getBorder({right: { style: 'medium' }, top:{style: 'medium'}, bottom:{style: 'medium'}});
            }
        });
        tableHeader.height = 130;
//table data 
let startCellNumber = 11;
        data.forEach((item, rowIndex) => {
            item?.Audits?.map((audit, a) => {
                const tableRow = worksheet.addRow([
                    `${item?.Area}`,
                    `${audit?.Name}`,
                    `${audit?.CurrentAuditInfo?.Item2 ?? ' '}`,
                    `${audit?.CurrentAuditInfo?.Item1 ?? '-'}`
                ]);

                const tableRowCellCount = tableRow.actualCellCount;
                tableRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.alignment = getAlignment({ wrapText: true });
                    cell.font = getFont({});
                    cell.border = getBorder({});

                    if (colNumber === 1) {
                        cell.border = getBorder({ left: { style: 'medium' } });
                    }
                    if (colNumber === tableRowCellCount) {
                        cell.border = getBorder({ right: { style: 'medium' }});
                    }

                    if (a === item?.Audits?.length - 1) {
                        cell.border = getBorder({ bottom: { style: 'medium' }});
                        if(colNumber === tableRowCellCount){
                            cell.border = getBorder({ right: { style: 'medium' }, bottom: {style: 'medium'}});
                        }
                    }

                    if (rowIndex % 2 === 0) {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '87ceeb' } // Blue color
                        };
                    }
                });
            });

            const rowCount = item?.Audits?.length || 1;
            const endCellNumber = startCellNumber + rowCount - 1;

            worksheet.mergeCells(`A${startCellNumber}:A${endCellNumber}`);
            worksheet.getCell(`A${endCellNumber}`).alignment = getAlignment({ textRotation: 90 });
            worksheet.getCell(`A${endCellNumber}`).border = getBorder({bottom: {style: 'medium'}});

            startCellNumber = endCellNumber + 1;
        });
//end table
        worksheet.addRow([]);
        
        const endPlaceAndDateRow = worksheet.addRow(['Wydruk aktualny na dzień:' + '  ' + `${formatDate(new Date(), true)}`]);
        endPlaceAndDateRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = getFont({});
        });
        const endPlaceAndDateRowCellNumber = startCellNumber + 1;
        worksheet.mergeCells(`A${endPlaceAndDateRowCellNumber}:B${endPlaceAndDateRowCellNumber}`);

        const endRow = worksheet.addRow(['', '---Koniec wydruku---']);
        endRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = getAlignment({});
            cell.font = getFont({});
        });

        worksheet.getColumn(1).width = 8;
        worksheet.getColumn(2).width = 45;
        worksheet.getColumn(3).width = 8;
        worksheet.getColumn(4).width = 15;

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'kompetencje dla pracownika.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <Button color="secondary" onClick={exportToExcel} disabled={data?.length === 0 || employeeData === null}>
            Pobierz Raport
        </Button>
    );
};

export default PersonalCompetenceExportFile;
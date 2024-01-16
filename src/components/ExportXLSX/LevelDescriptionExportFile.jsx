import React from 'react';
import ExcelJS from 'exceljs';
import { Button } from '@mui/material';

const LevelDescriptionExportFile = ({ data }) => {
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Opis poziomów wiedzy');

    //header
    const uniqueAuditNames = new Set(data.map(item => item.AuditName));
    // Convert the Set to an array if needed
    const uniqueAuditNamesArray = [...uniqueAuditNames];

    const headerRow = worksheet.addRow(['Poziom', ...uniqueAuditNamesArray.map(item => item)]);
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {top: {style:'thin'},
                     left: {style:'thin'},
                     bottom: {style:'thin'},
                     right: {style:'thin'}};
      cell.font = {
        name: 'Calibri',
        size: 11,
        bold: true,
      }
    });
    headerRow.height = 165;
    
    //0 level
    for (let i = 0; i < 3; i++) {
        var zeroLevelDescriptions = new Set(data.filter(item => item.Level === i))
        var zeroLevelDescriptionsArray = [...zeroLevelDescriptions]
        var levelRow = worksheet.addRow([i, ...zeroLevelDescriptionsArray.map(item => item.Description === '' ? '-' : item.Description)]);
        levelRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = {top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}};
            cell.font = {
            name: 'Calibri',
            size: 11,
            };
            if(i !== 1){
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {argb: 'e3efdb'},
                };
            }
        });
    }

    const font = { bold: true };
    worksheet.getCell('A2').font = font;
    worksheet.getCell('A3').font = font;
    worksheet.getCell('A4').font = font;

    for(let i = 2; i <= uniqueAuditNamesArray.length + 2; i++)
    {
        worksheet.getColumn(i).width = 22;
    }

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Opis poziomów wiedzy.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Button sx={{margin: "10px"}} color="secondary" onClick={exportToExcel} disabled={data?.length === 0}>
        Pobierz Raport dla wszystkich poziomów
    </Button>
  );
};

export default LevelDescriptionExportFile;

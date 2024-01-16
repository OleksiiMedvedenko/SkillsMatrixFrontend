import React from 'react';
import ExcelJS from 'exceljs';
import { Button } from '@mui/material';

const PersonalPurposeExportFile = ({ data }) => {
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('zapotrzebowanie na ilosc pracowników');

    const headerRow = worksheet.addRow(['Przelozony', '', ...data[0]?.Audits.map(item => item.Name)]);
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {top: {style:'thin'},
                     left: {style:'thin'},
                     bottom: {style:'thin'},
                     right: {style:'thin'}};
      cell.font = {
        name: 'Calibri',
        size: 11,
      }
    });
    headerRow.height = 165;
    worksheet.mergeCells('A1:B1');
    
    // Add the purpose row to the worksheet
    const purposeRow =  worksheet.addRow(['Cel osobowy', '', ...data[0]?.Audits.map(item => item.Purpose)]);
    purposeRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center', }; 
        cell.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };
        cell.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'fefe00'},
        };
        cell.font = {
            name: 'Calibri',
            size: 14,
            bold: true
        }
      });
    worksheet.mergeCells('A2:B2');

    data.forEach(item => {
        // First row
        const firstRow = worksheet.addRow([item.Supervisor?.FullName, 'Liczba osób z kompetencją 2', ...item.Audits.map(audit => audit.EmployeesWithLevelTwo)]);
        firstRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = {top: {style:'thin'},
                           left: {style:'thin'},
                           bottom: {style:'thin'},
                           right: {style:'thin'}};
            cell.font = {
              name: 'Calibri',
              size: 11,
            }
          });
  
        // Second row
        const secondRow = worksheet.addRow([null, 'Różnica', ...item.Audits.map(audit => audit.Difference)]);

        secondRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.font = {
            name: 'Calibri',
            size: 14,
          };
        
          // Calculate the fill color conditionally based on audit.Difference
          const fillColor = cell.value >= 0 ? { argb: 'c6efce' } : { argb: 'fec7cf' };
          if(cell.value !== 'Różnica')
          {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: fillColor,
              };
          }
        });
        
        // Merge the cells for 'Supervisor' to span two rows
        if (item.Supervisor?.FullName) {
            worksheet.mergeCells(`A${worksheet.lastRow.number - 1}:A${worksheet.lastRow.number}`);
        }

        worksheet.addRow([]);
      });

    worksheet.getColumn(1).width = 12;
    worksheet.getColumn(2).width = 13;

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zapotrzebowanie na ilosc pracowników.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Button color="secondary" onClick={exportToExcel} disabled={data?.length === 0}>
        Pobierz Raport
    </Button>
  );
};

export default PersonalPurposeExportFile;

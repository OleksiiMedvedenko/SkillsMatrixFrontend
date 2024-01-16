import React from 'react';
import ExcelJS from 'exceljs';
import { Button } from '@mui/material';

const LevelsExportFile = ({ data }) => {
    const flattenData = (data) => {
        return data.map((item) => {
          const flattenedItem = {
            'Nazwisko i Imie': item.Employee.FullName,
            'Stanowisko': item.Position.Name,
            'Przelożony': item.Supervisor.LastName + ' ' + item.Supervisor.FirstName,
          };
    
          item.AuditsInfo.forEach((auditInfo) => {
            const headerKey = `${auditInfo.Name}`;
            flattenedItem[headerKey] = auditInfo.CurrentAuditInfo.Item2 === null ? '-' : auditInfo.CurrentAuditInfo.Item2;
          });
    
          return flattenedItem;
        });
      };
    
      const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Poziomy kompetencji');

        const flattenedData = flattenData(data);
      
        // Generate Excel headers
        const headers = Object.keys(flattenedData[0]).map((key) => {
          return { header: key, key: key, width: 20 };
        });
        worksheet.columns = headers;
      
        // Populate data rows
        flattenedData.forEach((row) => {
          worksheet.addRow(row);
        });
      
        // Apply cell colors
        worksheet.eachRow((row, rowNumber) => {
            const fillColor = rowNumber % 2 === 0 ? 'E1F0CE' : 'FFFFFFFF'; 
            row.eachCell((cell, cellNumber) => {

                cell.border = {
                    top: { style: "thin", color: { argb: '54970E' } },
                    left: { style: "thin", color: { argb: '54970E' } },
                    bottom: { style: "thin", color: { argb: '54970E' } },
                    right: { style: "thin", color: { argb: '54970E' } },
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: fillColor },
                };

                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                if (rowNumber === 1 || cell.value === '-') {
                  // Header row, skip applying cell color
                  return;
                }
                
                const columnName = headers[cellNumber - 1].header;
                if(columnName !== 'Nazwisko i Imie' && columnName !== 'Stanowisko' && columnName !== 'Przelożony')
                {

                    if(cell.value != '-' || cell.value != null)
                    {
                        var value = cell.value;

                        if (value === 0) {
                            cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'DEDEDE' }, // grey color 
                            };
                        } 
                        else if(value === 1)
                        {   
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'F0ECAB' }, // yellow color 
                                };
                        }
                        else if(value === 2)
                        {   
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'C0E697' }, // green color
                            };
                        }
                        else 
                        {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFFF' }, // White color
                            };
                        }
                    }
                }
            });
          
        });
      
        // Generate vertical headers
        const headerRow = worksheet.getRow(1);
        headerRow.alignment = { textRotation: 90, vertical: 'middle', horizontal: 'center' };
        headerRow.height = 100;
        headerRow.font = { bold: true };

        // Calculate the table range
        const range = `A1:${String.fromCharCode(65 + headers.length - 1)}${data.length + 1}`;

        worksheet.table = [{
            ref: range, // Specify the range of cells for the table
            style: { 
                showRowStripes: true,
                theme: 'TableStyleLight21'
            }
            }];

        // Create a buffer from the workbook
        const buffer = await workbook.xlsx.writeBuffer();
      
        // Create a Blob from the buffer
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'poziomy-kompetencji.xlsx';
      
        // Simulate a click on the download link
        downloadLink.click();
      };

  return (
    <Button onClick={generateExcel} color="secondary" disabled={data?.length === 0}>
      Pobierz Raport
    </Button>
  );
};

export default LevelsExportFile;
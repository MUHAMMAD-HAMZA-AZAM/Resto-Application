import { Injectable } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
@Injectable({
  providedIn: 'root'
})
export class ExportsService {

  constructor() { }

  exportToCSV(data: any, fileTitle: string) {

    const options = {
      filename: fileTitle,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: fileTitle,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(data);
  }


  exportToExcel(data:any) {
    const worksheet = XLSX.utils.json_to_sheet(data); // get Data for Excel Sheet
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "Report");
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  //https://www.npmjs.com/package/export-to-csv

  //https://www.tutsmake.com/export-data-to-excel-in-angular-14/
}

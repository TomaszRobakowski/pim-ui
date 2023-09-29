import { HttpResponse } from "@angular/common/http";

export function getBlobResponseMetaData(response: unknown): [string, string] {
    const fileType = (response as HttpResponse<Blob>)?.type;
    let type = 'application/pdf';
    let extension = 'pdf';
    if (fileType) {
      type = fileType.toString();
      if (fileType.toString().indexOf('/') > 0) {
        const fileTypeAfterSplit = fileType.toString().split('/')[1];
        switch(fileTypeAfterSplit) {
            case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                extension =  'xlsx';
                break;
            case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                extension =  'docx';
                break;
            default: 
                extension = fileTypeAfterSplit;    
        }
      }
    }
    return [type, extension];
  }

export function getTimestamp(): string {
    const today = new Date();
    return `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}-${today.getSeconds()}${today.getMilliseconds()}`;
}
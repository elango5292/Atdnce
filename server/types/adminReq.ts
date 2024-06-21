// export some types 

export interface createEmployeeReq { body:{
    employeeName: string;
    employeeId: string;
    gender: string;
    image: string;
    role: string;}
}

export interface createSessionReq {
    body: {
        
        from : Date;
        to: Date;
        sessionNumber: number;
        action: string;
    }
   
}

export type addSessionReq = {
    body: {
        date: string;
        sessionNumber: number;
    };
}

export interface getSessionsReq  {
    body: {
        month: number;
        year: number;
    }
}

export interface getAttendanceLogsReq {
    body: {
        date: Date;
        sessionNumber: number;
    }
}
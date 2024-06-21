export type Employee = { name: string; gender: string; employeeId: string; role: string; }

export type Attendance = {
    name: string
    gender: string
    employeeId: string
    date: Date
    sessionId: string
    status: string
    sessionNumber: number
    absentReason: string
}

export type Session = {_id: string; from: Date; to: Date; sessionNumber: number; action: string; }


import { InternshipHour } from "../entity/InternshipHour";

export function mapInternshipHourToDTO(hour: InternshipHour) {
    return {
        id: hour.id,
        date: hour.date,
        startTime: hour.startTime,
        endTime: hour.endTime,
        description: hour.description,
        status: hour.status,
    }
}
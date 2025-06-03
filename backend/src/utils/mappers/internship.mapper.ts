import { Internship } from "../../entity/Internship";
import { InternshipDTO } from "../../types";

export function mapInternshipToDTO(internship: Internship): InternshipDTO {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentUser = (internship.student as any)?.user;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (value: any) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split("T")[0];
  };

  return {
    id: internship.id,
    startDate: formatDate(internship.startDate),
    endDate: formatDate(internship.endDate),
    isApproved: internship.isApproved,
    studentName: studentUser
      ? `${studentUser.firstname} ${studentUser.lastname}`
      : "N/A",
    studentNeptun: internship.student?.neptun ?? null,
    mentorName: internship.mentor?.user
      ? `${internship.mentor.user.firstname} ${internship.mentor.user.lastname}`
      : "N/A",
    companyName: internship.company?.name ?? "N/A",
  };
}

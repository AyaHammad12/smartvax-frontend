// src/types.d.ts

interface AppointmentDTO {
    id: number;
    appointmentDate: string;
    status: string;
    rescheduleReason?: string;
    child?: ChildDTO;
    parent?: any;
    healthWorker?: any;
    vaccinationCenter?: any;
    requestedNewCenter?: any;
    scheduleVaccinations: ScheduleVaccinationDTO[];
}

interface ScheduleVaccinationDTO {
    id: number;
    scheduledDate: string;
    status: string;
    child?: ChildDTO;
    vaccination?: VaccinationDTO;
    vaccinationGroup?: VaccinationGroupDTO;
}

interface ChildDTO {
    id: string;
    fullName?: string;
}

interface VaccinationDTO {
    id: number;
    name: string;
    group?: VaccinationGroupDTO;
    vaccineType?: any;
}

interface VaccinationGroupDTO {
    id: number;
    name: string;
}

// ─── Shared in-memory data store ────────────────────────────────────────────
// All dummy data lives here so controllers share the same arrays and
// mutations (POST / PATCH / DELETE) are reflected across requests.

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string; // never returned to clients
    role: "student" | "lecturer" | "admin";
    faculty: string;
    degree: string;
    completedCredits: number;
    totalCredits: number;
    avatar?: string;
    createdAt: string;
}

export interface Announcement {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: "low" | "medium" | "high";
    author: string;
    createdAt: string;
    updatedAt: string;
}

export interface Assignment {
    id: number;
    title: string;
    courseCode: string;
    description: string;
    dueDate: string;
    status: "Pending" | "Submitted" | "Graded" | "Overdue";
    marks?: number;
    maxMarks: number;
    submittedAt?: string;
}

export interface Course {
    code: string;
    name: string;
    credits: number;
    lecturer: string;
    semester: string;
    enrolled: number;
}

export interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    category: string;
    organizer: string;
    registeredCount: number;
}

export interface Facility {
    id: number;
    name: string;
    type: string;
    capacity: number;
    open: boolean;
    openHours: string;
    location: string;
    bookings: Booking[];
}

export interface Booking {
    id: number;
    facilityId: number;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    status: "confirmed" | "pending" | "cancelled";
}

export interface Notification {
    id: number;
    userId: string;
    message: string;
    type: "assignment" | "announcement" | "event" | "result" | "general";
    read: boolean;
    createdAt: string;
}

export interface Result {
    id: number;
    courseCode: string;
    course: string;
    semester: string;
    grade: string;
    gpa: number;
    marks: number;
    maxMarks: number;
    year: number;
}

export interface TimetableEntry {
    id: number;
    course: string;
    courseCode: string;
    day: string;
    time: string;
    hall: string;
    lecturer: string;
    type: "Lecture" | "Lab" | "Tutorial";
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const users: User[] = [
    {
        id: "CS-2022-095",
        name: "John Doe",
        email: "johndoe@university.edu",
        passwordHash: "$2b$10$hashedpassword", // never sent to client
        role: "student",
        faculty: "Science",
        degree: "Software Engineering",
        completedCredits: 90,
        totalCredits: 120,
        createdAt: "2022-09-01T00:00:00Z"
    },
    {
        id: "CS-2021-042",
        name: "Jane Smith",
        email: "janesmith@university.edu",
        passwordHash: "$2b$10$hashedpassword2",
        role: "student",
        faculty: "Science",
        degree: "Computer Science",
        completedCredits: 105,
        totalCredits: 120,
        createdAt: "2021-09-01T00:00:00Z"
    }
];

export const announcements: Announcement[] = [
    {
        id: 1,
        title: "Semester Registration",
        description: "Registration opens next Monday. Log in to the student portal to select your courses for the upcoming semester. Registration closes on June 30.",
        category: "Academic",
        priority: "high",
        author: "Registrar Office",
        createdAt: "2026-06-01T08:00:00Z",
        updatedAt: "2026-06-01T08:00:00Z"
    },
    {
        id: 2,
        title: "Exam Timetable Released",
        description: "The final examination timetable has been released. Check the university portal under 'Exams' for your schedule.",
        category: "Exams",
        priority: "high",
        author: "Examinations Department",
        createdAt: "2026-06-05T10:00:00Z",
        updatedAt: "2026-06-05T10:00:00Z"
    },
    {
        id: 3,
        title: "Library Extended Hours",
        description: "The Main Library will remain open until midnight during the examination period (June 20 – July 10).",
        category: "Facility",
        priority: "medium",
        author: "Library Services",
        createdAt: "2026-06-10T09:00:00Z",
        updatedAt: "2026-06-10T09:00:00Z"
    }
];

export const assignments: Assignment[] = [
    {
        id: 1,
        title: "React Assignment",
        courseCode: "SENG41293",
        description: "Build a responsive React dashboard with hooks and context API. Include at least 5 components and proper state management.",
        dueDate: "2026-06-20",
        status: "Pending",
        maxMarks: 100
    },
    {
        id: 2,
        title: "Database Project",
        courseCode: "SENG41123",
        description: "Design and implement a normalized relational database for a library management system. Include ER diagram and SQL scripts.",
        dueDate: "2026-06-10",
        status: "Submitted",
        maxMarks: 100,
        submittedAt: "2026-06-09T14:30:00Z"
    },
    {
        id: 3,
        title: "Network Protocols Report",
        courseCode: "SENG41456",
        description: "Write a 2000-word report comparing TCP/IP and OSI models with real-world examples.",
        dueDate: "2026-06-25",
        status: "Pending",
        maxMarks: 50
    }
];

export const courses: Course[] = [
    {
        code: "SENG41293",
        name: "Mobile Web Development",
        credits: 3,
        lecturer: "Dr. Sarah Kim",
        semester: "2026-S1",
        enrolled: 45
    },
    {
        code: "SENG41123",
        name: "Distributed Systems",
        credits: 4,
        lecturer: "Prof. Alan Turing",
        semester: "2026-S1",
        enrolled: 38
    },
    {
        code: "SENG41456",
        name: "Computer Networks",
        credits: 3,
        lecturer: "Dr. Priya Nair",
        semester: "2026-S1",
        enrolled: 52
    }
];

export const events: Event[] = [
    {
        id: 1,
        name: "Hackathon 2026",
        description: "48-hour coding competition. Teams of 2-4 build innovative solutions to real-world problems. Prizes worth $5,000.",
        date: "2026-07-15",
        time: "09:00 AM",
        venue: "Engineering Block, Main Hall",
        category: "Competition",
        organizer: "CS Student Society",
        registeredCount: 120
    },
    {
        id: 2,
        name: "Career Fair",
        description: "Meet recruiters from 30+ top tech companies. Bring your CV. Business attire recommended.",
        date: "2026-08-01",
        time: "10:00 AM",
        venue: "University Convention Center",
        category: "Career",
        organizer: "Career Development Office",
        registeredCount: 350
    },
    {
        id: 3,
        name: "AI & ML Workshop",
        description: "Hands-on workshop on machine learning fundamentals using Python and scikit-learn.",
        date: "2026-06-25",
        time: "02:00 PM",
        venue: "Lab 03, Science Block",
        category: "Workshop",
        organizer: "AI Research Club",
        registeredCount: 60
    }
];

let bookingIdCounter = 1;

export const facilities: Facility[] = [
    {
        id: 1,
        name: "Main Library",
        type: "Library",
        capacity: 200,
        open: true,
        openHours: "07:00 AM – 10:00 PM",
        location: "Building A, Ground Floor",
        bookings: []
    },
    {
        id: 2,
        name: "Computer Lab 01",
        type: "Lab",
        capacity: 40,
        open: true,
        openHours: "08:00 AM – 06:00 PM",
        location: "Building B, 2nd Floor",
        bookings: []
    },
    {
        id: 3,
        name: "Study Room 3",
        type: "Study Room",
        capacity: 10,
        open: true,
        openHours: "08:00 AM – 08:00 PM",
        location: "Main Library, 1st Floor",
        bookings: []
    },
    {
        id: 4,
        name: "Sports Hall",
        type: "Sports",
        capacity: 100,
        open: false,
        openHours: "Closed for renovation",
        location: "Sports Complex",
        bookings: []
    }
];

export const notifications: Notification[] = [
    {
        id: 1,
        userId: "CS-2022-095",
        message: "React Assignment deadline is tomorrow (June 20).",
        type: "assignment",
        read: false,
        createdAt: "2026-06-19T08:00:00Z"
    },
    {
        id: 2,
        userId: "CS-2022-095",
        message: "Distributed Systems quiz starts at 2 PM today in A101.",
        type: "assignment",
        read: false,
        createdAt: "2026-06-16T07:00:00Z"
    },
    {
        id: 3,
        userId: "CS-2022-095",
        message: "New announcement: Exam Timetable Released.",
        type: "announcement",
        read: true,
        createdAt: "2026-06-05T10:05:00Z"
    },
    {
        id: 4,
        userId: "CS-2022-095",
        message: "Your Database Project submission was received.",
        type: "result",
        read: true,
        createdAt: "2026-06-09T14:32:00Z"
    }
];

export const results: Result[] = [
    {
        id: 1,
        courseCode: "SENG41293",
        course: "Mobile Web Development",
        semester: "2025-S2",
        grade: "A",
        gpa: 4.0,
        marks: 88,
        maxMarks: 100,
        year: 2025
    },
    {
        id: 2,
        courseCode: "SENG41000",
        course: "Database Systems",
        semester: "2025-S2",
        grade: "B+",
        gpa: 3.3,
        marks: 76,
        maxMarks: 100,
        year: 2025
    },
    {
        id: 3,
        courseCode: "SENG40789",
        course: "Software Engineering",
        semester: "2025-S1",
        grade: "A-",
        gpa: 3.7,
        marks: 82,
        maxMarks: 100,
        year: 2025
    }
];

export const timetable: TimetableEntry[] = [
    {
        id: 1,
        course: "Mobile Web Development",
        courseCode: "SENG41293",
        day: "Monday",
        time: "08:00 AM – 10:00 AM",
        hall: "Lab 01",
        lecturer: "Dr. Sarah Kim",
        type: "Lab"
    },
    {
        id: 2,
        course: "Distributed Systems",
        courseCode: "SENG41123",
        day: "Monday",
        time: "11:00 AM – 01:00 PM",
        hall: "A101",
        lecturer: "Prof. Alan Turing",
        type: "Lecture"
    },
    {
        id: 3,
        course: "Computer Networks",
        courseCode: "SENG41456",
        day: "Tuesday",
        time: "09:00 AM – 11:00 AM",
        hall: "B202",
        lecturer: "Dr. Priya Nair",
        type: "Lecture"
    },
    {
        id: 4,
        course: "Mobile Web Development",
        courseCode: "SENG41293",
        day: "Wednesday",
        time: "02:00 PM – 04:00 PM",
        hall: "A103",
        lecturer: "Dr. Sarah Kim",
        type: "Tutorial"
    },
    {
        id: 5,
        course: "Distributed Systems",
        courseCode: "SENG41123",
        day: "Thursday",
        time: "10:00 AM – 12:00 PM",
        hall: "B201",
        lecturer: "Prof. Alan Turing",
        type: "Lab"
    },
    {
        id: 6,
        course: "Computer Networks",
        courseCode: "SENG41456",
        day: "Friday",
        time: "01:00 PM – 03:00 PM",
        hall: "A101",
        lecturer: "Dr. Priya Nair",
        type: "Tutorial"
    }
];

// ─── Counter helpers ──────────────────────────────────────────────────────────
export const counters = {
    announcement: 4,
    assignment: 4,
    event: 4,
    notification: 5,
    result: 4,
    timetable: 7,
    booking: bookingIdCounter
};

export function nextId(key: keyof typeof counters): number {
    return counters[key]++;
}

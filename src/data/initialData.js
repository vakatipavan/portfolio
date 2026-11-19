// Initial portfolio data
// Strictly personal and educational information only.
// Empty arrays for projects, achievements, certifications, and positions so the user can enter their own real data.

export const initialData = {
  personal: {
    name: "Vakati Pavan Kumar",
    title: "B.E. Computer Science and Engineering (AI & ML)",
    intro: "Computer Science and Engineering student at Rajalakshmi Institute of Technology, specializing in Artificial Intelligence & Machine Learning. Focused on core software development, algorithms, and practical problem-solving."
  },
  education: [
    {
      id: "edu-1",
      level: "Engineering / College",
      institution: "Rajalakshmi Institute of Technology",
      degree: "B.E. Computer Science and Engineering (AI & ML)",
      period: "2023 - 2027",
      score: "CGPA: 8.8 / 10.0",
      details: "Anna University affiliated. Core coursework: Data Structures, AI & ML, DBMS, Operating Systems."
    },
    {
      id: "edu-2",
      level: "Intermediate",
      institution: "",
      degree: "Class XII (Intermediate / Higher Secondary)",
      period: "",
      score: "",
      details: ""
    },
    {
      id: "edu-3",
      level: "Schooling",
      institution: "",
      degree: "Class X (Secondary School)",
      period: "",
      score: "",
      details: ""
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Programming Languages",
      items: ["Python", "Java", "C++", "JavaScript", "C"]
    },
    {
      id: "skill-2",
      category: "Web & Database Technologies",
      items: ["React", "Tailwind CSS", "HTML5", "CSS3", "MySQL"]
    },
    {
      id: "skill-3",
      category: "Core Subjects & Tools",
      items: ["Data Structures & Algorithms", "Object-Oriented Programming", "DBMS", "Git", "GitHub"]
    }
  ],
  projects: [],
  achievements: [],
  certifications: [],
  competitions: [],
  positions: [],
  interests: [],
  contact: {
    email: "vakatipavankumar.official@gmail.com",
    phone: "",
    location: "Chennai, Tamil Nadu, India",
    linkedin: "https://www.linkedin.com/in/vakati-pavan-kumar",
    github: "https://github.com/vakatipavan",
    twitter: ""
  }
};

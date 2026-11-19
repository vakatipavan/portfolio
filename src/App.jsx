import React, { useState, useEffect } from 'react';
import { initialData } from './data/initialData';
import { 
  fetchPortfolioData, 
  persistPortfolioData, 
  subscribeToAuth, 
  logoutAdmin 
} from './firebase';

import { Navbar } from './components/Navbar';
import { PersonalSection } from './components/PersonalSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AchievementsSection } from './components/AchievementsSection';
import { PositionsSection } from './components/PositionsSection';
import { InterestsSection } from './components/InterestsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { AdminLoginModal } from './components/AdminLoginModal';
import { FirebaseSettingsModal } from './components/FirebaseSettingsModal';
import { EditModal } from './components/EditModal';
import { Toast } from './components/Toast';

export function App() {
  const [data, setData] = useState(initialData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    title: '',
    fields: [],
    initialData: {},
    onSave: () => {}
  });

  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 2800);
  };

  // Load initial data from Firestore / LocalStorage
  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchPortfolioData(initialData);
        if (result && result.data) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      }
    }
    loadData();

    // Subscribe to auth state
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        setIsAdmin(true);
        setAdminUser(user);
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Secret admin shortcut listener: Ctrl+A or Shift+A opens Admin Portal
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      const isKeyA = e.key === 'a' || e.key === 'A';
      const isShiftA = e.shiftKey && isKeyA && !e.ctrlKey && !e.altKey && !e.metaKey;
      const isCtrlA = (e.ctrlKey || e.metaKey) && isKeyA;

      if (!isInput && (isShiftA || isCtrlA)) {
        e.preventDefault();
        setLoginModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update and persist data
  const handleUpdateData = async (updater) => {
    const updated = typeof updater === 'function' ? updater(data) : updater;
    setData(updated);

    try {
      const res = await persistPortfolioData(updated);
      if (res.savedToCloud) {
        showToast('Changes saved to Firebase Cloud!');
      } else {
        showToast('Changes saved locally! (Connect Firebase for cloud sync)');
      }
    } catch (e) {
      console.error("Save error:", e);
      showToast('Saved locally', 'info');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
    setAdminUser(null);
    showToast('Logged out of admin mode');
  };

  const closeEditModal = () => {
    setEditModal((prev) => ({ ...prev, isOpen: false }));
  };

  // --------------------------------------------------------------------------
  // 1. EDIT PERSONAL DETAILS
  // --------------------------------------------------------------------------
  const handleEditPersonal = () => {
    setEditModal({
      isOpen: true,
      title: 'Edit Personal Details',
      fields: [
        { name: 'name', label: 'Full Name', required: true, placeholder: 'Vakati Pavan Kumar' },
        { name: 'title', label: 'Role / Degree Title', required: true, placeholder: 'B.E. Computer Science and Engineering (AI & ML)' },
        { name: 'intro', label: 'Introduction / Bio', type: 'textarea', rows: 4, placeholder: 'Brief summary about yourself, focus, and interests...' }
      ],
      initialData: data.personal || {},
      onSave: (formData) => {
        handleUpdateData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            name: formData.name,
            title: formData.title,
            intro: formData.intro
          }
        }));
      }
    });
  };

  // --------------------------------------------------------------------------
  // 2. EDUCATION HANDLERS
  // --------------------------------------------------------------------------
  const handleAddEducation = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Education Record',
      fields: [
        {
          name: 'level',
          label: 'Education Level',
          type: 'select',
          required: true,
          options: [
            { value: 'Engineering / College', label: 'Engineering / College' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Schooling', label: 'Schooling' },
            { value: 'Post-Graduation', label: 'Post-Graduation' },
            { value: 'Other', label: 'Other' }
          ]
        },
        { name: 'institution', label: 'School / College / Institution Name', required: true, placeholder: 'e.g. Rajalakshmi Institute of Technology' },
        { name: 'degree', label: 'Degree / Course / Stream', required: true, placeholder: 'e.g. B.E. Computer Science and Engineering (AI & ML)' },
        { name: 'period', label: 'Duration / Period', placeholder: 'e.g. 2023 - 2027' },
        { name: 'score', label: 'Score / CGPA / Percentage', placeholder: 'e.g. CGPA: 8.8 / 10.0 or 95%' },
        { name: 'details', label: 'Key Coursework or Highlights (Optional)', type: 'textarea', rows: 3 }
      ],
      initialData: {
        level: 'Engineering / College',
        institution: '',
        degree: '',
        period: '',
        score: '',
        details: ''
      },
      onSave: (formData) => {
        const newItem = {
          id: 'edu-' + Date.now(),
          ...formData
        };
        handleUpdateData((prev) => ({
          ...prev,
          education: [...(prev.education || []), newItem]
        }));
      }
    });
  };

  const handleEditEducation = (item) => {
    setEditModal({
      isOpen: true,
      title: `Edit ${item.level || 'Education'} Record`,
      fields: [
        {
          name: 'level',
          label: 'Education Level',
          type: 'select',
          required: true,
          options: [
            { value: 'Engineering / College', label: 'Engineering / College' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Schooling', label: 'Schooling' },
            { value: 'Post-Graduation', label: 'Post-Graduation' },
            { value: 'Other', label: 'Other' }
          ]
        },
        { name: 'institution', label: 'School / College / Institution Name', required: true },
        { name: 'degree', label: 'Degree / Course / Stream', required: true },
        { name: 'period', label: 'Duration / Period' },
        { name: 'score', label: 'Score / CGPA / Percentage' },
        { name: 'details', label: 'Key Coursework or Highlights (Optional)', type: 'textarea', rows: 3 }
      ],
      initialData: item,
      onSave: (formData) => {
        handleUpdateData((prev) => ({
          ...prev,
          education: prev.education.map((e) => (e.id === item.id ? { ...e, ...formData } : e))
        }));
      }
    });
  };

  const handleDeleteEducation = (id) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      handleUpdateData((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== id)
      }));
      showToast('Education record deleted');
    }
  };

  // --------------------------------------------------------------------------
  // 3. SKILLS HANDLERS
  // --------------------------------------------------------------------------
  const handleAddSkillCategory = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Skill Category',
      fields: [
        { name: 'category', label: 'Category Name', required: true, placeholder: 'e.g. Programming Languages' },
        { 
          name: 'itemsStr', 
          label: 'Skills (Comma-separated)', 
          required: true, 
          placeholder: 'Python, Java, C++, JavaScript',
          helper: 'Separate each skill with a comma.'
        }
      ],
      initialData: { category: '', itemsStr: '' },
      onSave: (formData) => {
        const items = (formData.itemsStr || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const newGroup = {
          id: 'skill-' + Date.now(),
          category: formData.category,
          items
        };

        handleUpdateData((prev) => ({
          ...prev,
          skills: [...(prev.skills || []), newGroup]
        }));
      }
    });
  };

  const handleEditSkillCategory = (group) => {
    setEditModal({
      isOpen: true,
      title: 'Edit Skill Category',
      fields: [
        { name: 'category', label: 'Category Name', required: true },
        { 
          name: 'itemsStr', 
          label: 'Skills (Comma-separated)', 
          required: true, 
          helper: 'Separate each skill with a comma.' 
        }
      ],
      initialData: {
        category: group.category,
        itemsStr: (group.items || []).join(', ')
      },
      onSave: (formData) => {
        const items = (formData.itemsStr || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        handleUpdateData((prev) => ({
          ...prev,
          skills: prev.skills.map((s) =>
            s.id === group.id ? { ...s, category: formData.category, items } : s
          )
        }));
      }
    });
  };

  const handleDeleteSkillCategory = (id) => {
    if (window.confirm('Delete this entire skill category?')) {
      handleUpdateData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== id)
      }));
      showToast('Skill category deleted');
    }
  };

  // --------------------------------------------------------------------------
  // 4. PROJECTS HANDLERS
  // --------------------------------------------------------------------------
  const handleAddProject = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Project',
      fields: [
        { name: 'title', label: 'Project Title', required: true, placeholder: 'e.g. Real-Time Chat Application' },
        { name: 'description', label: 'Project Description', type: 'textarea', rows: 4, placeholder: 'Describe what the project does, key features, and your role...' },
        { 
          name: 'techStr', 
          label: 'Technologies Used (Comma-separated)', 
          placeholder: 'React, Node.js, Socket.io, Tailwind CSS',
          helper: 'e.g. Python, TensorFlow, React, FastAPI'
        },
        { name: 'github', label: 'GitHub Repository Link (Optional)', placeholder: 'https://github.com/vakatipavan/repo' },
        { name: 'live', label: 'Live Demo URL (Optional)', placeholder: 'https://project-demo.vercel.app' }
      ],
      initialData: {
        title: '',
        description: '',
        techStr: '',
        github: '',
        live: ''
      },
      onSave: (formData) => {
        const technologies = (formData.techStr || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

        const newProject = {
          id: 'proj-' + Date.now(),
          title: formData.title,
          description: formData.description,
          technologies,
          github: formData.github,
          live: formData.live
        };

        handleUpdateData((prev) => ({
          ...prev,
          projects: [...(prev.projects || []), newProject]
        }));
      }
    });
  };

  const handleEditProject = (proj) => {
    setEditModal({
      isOpen: true,
      title: 'Edit Project',
      fields: [
        { name: 'title', label: 'Project Title', required: true },
        { name: 'description', label: 'Project Description', type: 'textarea', rows: 4 },
        { 
          name: 'techStr', 
          label: 'Technologies Used (Comma-separated)', 
          helper: 'Separate technologies with a comma.'
        },
        { name: 'github', label: 'GitHub Repository Link (Optional)' },
        { name: 'live', label: 'Live Demo URL (Optional)' }
      ],
      initialData: {
        title: proj.title || '',
        description: proj.description || '',
        techStr: (proj.technologies || []).join(', '),
        github: proj.github || '',
        live: proj.live || ''
      },
      onSave: (formData) => {
        const technologies = (formData.techStr || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

        handleUpdateData((prev) => ({
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === proj.id ? { ...p, ...formData, technologies } : p
          )
        }));
      }
    });
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      handleUpdateData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id)
      }));
      showToast('Project removed');
    }
  };

  // --------------------------------------------------------------------------
  // 5. ACHIEVEMENTS & CERTIFICATIONS HANDLERS
  // --------------------------------------------------------------------------
  const handleAddAchievement = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Achievement',
      fields: [
        { name: 'title', label: 'Achievement Title', required: true, placeholder: 'e.g. Finalist in Hackathon' },
        { name: 'issuer', label: 'Organizing Body / Event', placeholder: 'e.g. Smart India Hackathon / College TechFest' },
        { name: 'year', label: 'Year / Date', placeholder: 'e.g. 2024' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
      ],
      initialData: { title: '', issuer: '', year: '', description: '' },
      onSave: (formData) => {
        const newAchievement = { id: 'ach-' + Date.now(), ...formData };
        handleUpdateData((prev) => ({
          ...prev,
          achievements: [...(prev.achievements || []), newAchievement]
        }));
      }
    });
  };

  const handleEditAchievement = (item) => {
    setEditModal({
      isOpen: true,
      title: 'Edit Achievement',
      fields: [
        { name: 'title', label: 'Achievement Title', required: true },
        { name: 'issuer', label: 'Organizing Body / Event' },
        { name: 'year', label: 'Year / Date' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3 }
      ],
      initialData: item,
      onSave: (formData) => {
        handleUpdateData((prev) => ({
          ...prev,
          achievements: prev.achievements.map((a) => (a.id === item.id ? { ...a, ...formData } : a))
        }));
      }
    });
  };

  const handleDeleteAchievement = (id) => {
    if (window.confirm('Delete this achievement?')) {
      handleUpdateData((prev) => ({
        ...prev,
        achievements: prev.achievements.filter((a) => a.id !== id)
      }));
      showToast('Achievement removed');
    }
  };

  const handleAddCertificate = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Certification',
      fields: [
        { name: 'title', label: 'Certificate Name', required: true, placeholder: 'e.g. Python for Data Science' },
        { name: 'issuer', label: 'Issuing Organization', required: true, placeholder: 'e.g. Coursera / IBM / NPTEL' },
        { name: 'date', label: 'Issue Date', placeholder: 'e.g. July 2024' },
        { name: 'credentialId', label: 'Credential ID (Optional)', placeholder: 'e.g. CERT-123456' },
        { name: 'link', label: 'Verification URL (Optional)', placeholder: 'https://coursera.org/verify/...' }
      ],
      initialData: { title: '', issuer: '', date: '', credentialId: '', link: '' },
      onSave: (formData) => {
        const newCert = { id: 'cert-' + Date.now(), ...formData };
        handleUpdateData((prev) => ({
          ...prev,
          certifications: [...(prev.certifications || []), newCert]
        }));
      }
    });
  };

  const handleEditCertificate = (cert) => {
    setEditModal({
      isOpen: true,
      title: 'Edit Certification',
      fields: [
        { name: 'title', label: 'Certificate Name', required: true },
        { name: 'issuer', label: 'Issuing Organization', required: true },
        { name: 'date', label: 'Issue Date' },
        { name: 'credentialId', label: 'Credential ID (Optional)' },
        { name: 'link', label: 'Verification URL (Optional)' }
      ],
      initialData: cert,
      onSave: (formData) => {
        handleUpdateData((prev) => ({
          ...prev,
          certifications: prev.certifications.map((c) => (c.id === cert.id ? { ...c, ...formData } : c))
        }));
      }
    });
  };

  const handleDeleteCertificate = (id) => {
    if (window.confirm('Delete this certificate?')) {
      handleUpdateData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c.id !== id)
      }));
      showToast('Certificate removed');
    }
  };

  const handleAddCompetition = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Competition / Event Participated',
      fields: [
        { name: 'name', label: 'Event / Competition Name', required: true, placeholder: 'e.g. Smart India Hackathon / Inter-College TechFest' },
        { name: 'organizer', label: 'Organizing Body / Institution', placeholder: 'e.g. AICTE / IIT Madras / College Dept' },
        { name: 'year', label: 'Year / Date', placeholder: 'e.g. Oct 2024' },
        { name: 'role', label: 'Role / Participation Status', placeholder: 'e.g. Participant / Finalist / Team Lead' },
        { name: 'description', label: 'Description / Highlights', type: 'textarea', rows: 3, placeholder: 'Brief note about what was presented or built...' },
        { name: 'link', label: 'Certificate / Project Link (Optional)', placeholder: 'https://...' }
      ],
      initialData: { name: '', organizer: '', year: '', role: '', description: '', link: '' },
      onSave: (formData) => {
        const newEvent = { id: 'evt-' + Date.now(), ...formData };
        handleUpdateData((prev) => ({
          ...prev,
          competitions: [...(prev.competitions || []), newEvent]
        }));
      }
    });
  };

  const handleEditCompetition = (item) => {
    setEditModal({
      isOpen: true,
      title: 'Edit Competition / Event Participated',
      fields: [
        { name: 'name', label: 'Event / Competition Name', required: true },
        { name: 'organizer', label: 'Organizing Body / Institution' },
        { name: 'year', label: 'Year / Date' },
        { name: 'role', label: 'Role / Participation Status' },
        { name: 'description', label: 'Description / Highlights', type: 'textarea', rows: 3 },
        { name: 'link', label: 'Certificate / Project Link (Optional)' }
      ],
      initialData: item,
      onSave: (formData) => {
        handleUpdateData((prev) => ({
          ...prev,
          competitions: (prev.competitions || []).map((c) => (c.id === item.id ? { ...c, ...formData } : c))
        }));
      }
    });
  };

  const handleDeleteCompetition = (id) => {
    if (window.confirm('Delete this event / competition?')) {
      handleUpdateData((prev) => ({
        ...prev,
        competitions: (prev.competitions || []).filter((c) => c.id !== id)
      }));
      showToast('Event removed');
    }
  };

  // --------------------------------------------------------------------------
  // 6. POSITIONS & RESPONSIBILITIES HANDLERS
  // --------------------------------------------------------------------------
  const handleAddPosition = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Position of Responsibility',
      fields: [
        { name: 'role', label: 'Role / Position Title', required: true, placeholder: 'e.g. Technical Club Lead / Student Coordinator' },
        { name: 'organization', label: 'Club / Organization / Department', required: true, placeholder: 'e.g. RIT AI Club / Department of CSE' },
        { name: 'duration', label: 'Duration / Period', placeholder: 'e.g. Aug 2023 - Present' },
        { name: 'description', label: 'Key Responsibilities', type: 'textarea', rows: 4, placeholder: 'Describe your duties, organized events, and team contributions...' }
      ],
      initialData: { role: '', organization: '', duration: '', description: '' },
      onSave: (formData) => {
        const newPos = { id: 'pos-' + Date.now(), ...formData };
        handleUpdateData((prev) => ({
          ...prev,
          positions: [...(prev.positions || []), newPos]
        }));
      }
    });
  };

  const handleEditPosition = (pos) => {
    setEditModal({
      isOpen: true,
      title: 'Edit Position of Responsibility',
      fields: [
        { name: 'role', label: 'Role / Position Title', required: true },
        { name: 'organization', label: 'Club / Organization / Department', required: true },
        { name: 'duration', label: 'Duration / Period' },
        { name: 'description', label: 'Key Responsibilities', type: 'textarea', rows: 4 }
      ],
      initialData: pos,
      onSave: (formData) => {
        handleUpdateData((prev) => ({
          ...prev,
          positions: prev.positions.map((p) => (p.id === pos.id ? { ...p, ...formData } : p))
        }));
      }
    });
  };

  const handleDeletePosition = (id) => {
    if (window.confirm('Delete this position?')) {
      handleUpdateData((prev) => ({
        ...prev,
        positions: prev.positions.filter((p) => p.id !== id)
      }));
      showToast('Position removed');
    }
  };

  // --------------------------------------------------------------------------
  // 7. HOBBIES & INTERESTS HANDLERS
  // --------------------------------------------------------------------------
  const handleAddInterest = () => {
    setEditModal({
      isOpen: true,
      title: 'Add Hobbies / Interests Category',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          options: [
            { value: 'Hobbies', label: '📚 Hobbies' },
            { value: 'Sports', label: '⚽ Sports' },
            { value: 'Games', label: '🎮 Games' },
            { value: 'Creative', label: '🎨 Creative Interests' },
            { value: 'Other', label: '✨ Other' },
          ]
        },
        {
          name: 'itemsStr',
          label: 'Items (Comma-separated)',
          required: true,
          placeholder: 'e.g. Cricket, Chess, Reading, Gaming',
          helper: 'Separate each item with a comma.'
        }
      ],
      initialData: { category: 'Hobbies', itemsStr: '' },
      onSave: (formData) => {
        const items = (formData.itemsStr || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        const newGroup = { id: 'int-' + Date.now(), category: formData.category, items };
        handleUpdateData((prev) => ({
          ...prev,
          interests: [...(prev.interests || []), newGroup]
        }));
      }
    });
  };

  const handleEditInterest = (group) => {
    setEditModal({
      isOpen: true,
      title: 'Edit Interests Category',
      fields: [
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          options: [
            { value: 'Hobbies', label: '📚 Hobbies' },
            { value: 'Sports', label: '⚽ Sports' },
            { value: 'Games', label: '🎮 Games' },
            { value: 'Creative', label: '🎨 Creative Interests' },
            { value: 'Other', label: '✨ Other' },
          ]
        },
        {
          name: 'itemsStr',
          label: 'Items (Comma-separated)',
          required: true,
          helper: 'Separate each item with a comma.'
        }
      ],
      initialData: { category: group.category, itemsStr: (group.items || []).join(', ') },
      onSave: (formData) => {
        const items = (formData.itemsStr || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        handleUpdateData((prev) => ({
          ...prev,
          interests: prev.interests.map((g) =>
            g.id === group.id ? { ...g, category: formData.category, items } : g
          )
        }));
      }
    });
  };

  const handleDeleteInterest = (id) => {
    if (window.confirm('Delete this interest category?')) {
      handleUpdateData((prev) => ({
        ...prev,
        interests: prev.interests.filter((g) => g.id !== id)
      }));
      showToast('Interest category removed');
    }
  };

  // --------------------------------------------------------------------------
  // 8. CONTACT DETAILS HANDLER
  // --------------------------------------------------------------------------
  const handleEditContact = () => {
    setEditModal({
      isOpen: true,
      title: 'Edit Contact Details & Links',
      fields: [
        { name: 'email', label: 'Email Address', required: true, placeholder: 'name@gmail.com' },
        { name: 'phone', label: 'Phone Number (Optional)', placeholder: '+91 98765 43210' },
        { name: 'location', label: 'Location (City, Country)', placeholder: 'Chennai, Tamil Nadu, India' },
        { name: 'linkedin', label: 'LinkedIn Profile URL', placeholder: 'https://linkedin.com/in/username' },
        { name: 'github', label: 'GitHub Profile URL', placeholder: 'https://github.com/username' },
        { name: 'twitter', label: 'Twitter / X Profile URL (Optional)', placeholder: 'https://twitter.com/username' }
      ],
      initialData: data.contact || {},
      onSave: (formData) => {
        handleUpdateData((prev) => ({
          ...prev,
          contact: {
            ...prev.contact,
            ...formData
          }
        }));
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        isAdmin={isAdmin}
        adminUser={adminUser}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenDbSettings={() => setDbModalOpen(true)}
      />

      {/* Main Content Area - Strictly the 7 sections */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6">
        {/* 1. Personal Details */}
        <PersonalSection
          data={data}
          isAdmin={isAdmin}
          onEdit={handleEditPersonal}
        />

        {/* 2. Education (Schooling, Intermediate, Engineering / College) */}
        <EducationSection
          education={data.education || []}
          isAdmin={isAdmin}
          onAdd={handleAddEducation}
          onEdit={handleEditEducation}
          onDelete={handleDeleteEducation}
        />

        {/* 3. Technical Skills */}
        <SkillsSection
          skills={data.skills || []}
          isAdmin={isAdmin}
          onAdd={handleAddSkillCategory}
          onEdit={handleEditSkillCategory}
          onDelete={handleDeleteSkillCategory}
        />

        {/* 4. My Projects */}
        <ProjectsSection
          projects={data.projects || []}
          isAdmin={isAdmin}
          onAdd={handleAddProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />

        {/* 5. Achievements, Certifications & Participations */}
        <AchievementsSection
          achievements={data.achievements || []}
          certifications={data.certifications || []}
          competitions={data.competitions || []}
          isAdmin={isAdmin}
          onAddAchievement={handleAddAchievement}
          onEditAchievement={handleEditAchievement}
          onDeleteAchievement={handleDeleteAchievement}
          onAddCertificate={handleAddCertificate}
          onEditCertificate={handleEditCertificate}
          onDeleteCertificate={handleDeleteCertificate}
          onAddCompetition={handleAddCompetition}
          onEditCompetition={handleEditCompetition}
          onDeleteCompetition={handleDeleteCompetition}
        />

        {/* 6. Positions and Responsibilities */}
        <PositionsSection
          positions={data.positions || []}
          isAdmin={isAdmin}
          onAdd={handleAddPosition}
          onEdit={handleEditPosition}
          onDelete={handleDeletePosition}
        />

        {/* 7. Hobbies & Interests */}
        <InterestsSection
          interests={data.interests || []}
          isAdmin={isAdmin}
          onAdd={handleAddInterest}
          onEdit={handleEditInterest}
          onDelete={handleDeleteInterest}
        />

        {/* 8. Contact Details */}
        <ContactSection
          contact={data.contact || {}}
          isAdmin={isAdmin}
          onEdit={handleEditContact}
        />
      </main>

      {/* Footer */}
      <Footer
        isAdmin={isAdmin}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setIsAdmin(true);
          setAdminUser(user);
          showToast(`Welcome back, ${user.email}! Admin mode activated.`);
        }}
      />

      {/* Firebase & Firestore Cloud Config Modal */}
      <FirebaseSettingsModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        onConfigSaved={() => {
          showToast('Firebase configuration updated.');
        }}
      />

      {/* Reusable Section Edit Modal */}
      <EditModal
        isOpen={editModal.isOpen}
        title={editModal.title}
        fields={editModal.fields}
        initialData={editModal.initialData}
        onSave={editModal.onSave}
        onClose={closeEditModal}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
    </div>
  );
}
export default App;

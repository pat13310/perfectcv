export const parseCV = jest.fn().mockResolvedValue({
  text: 'Mocked CV content',
  sections: {
    education: [],
    experience: [],
    skills: [],
    projects: [],
  },
});

export const extractSections = jest.fn().mockReturnValue({
  education: [],
  experience: [],
  skills: [],
  projects: [],
});

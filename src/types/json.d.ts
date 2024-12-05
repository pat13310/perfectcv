declare module "*.json" {
    const content: {
        title: string;
        home: string;
        assistant: string;
        templates: string;
        preview: string;
        subtitle: string;
        description: string;
        startButton: string;
        improveButton: string;
        uploadHint: string;
        features: {
            fast: {
                title: string;
                description: string;
            };
            templates: {
                title: string;
                description: string;
            };
            ai: {
                title: string;
                description: string;
            };
        };
        testimonials: {
            title: string;
            roles: {
                developer: string;
                manager: string;
            };
            content1: string;
            content2: string;
        };
        form: {
            personalInfo: {
                title: string;
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
                address: string;
                summary: string;
                save: string;
            };
            workExperience: {
                title: string;
                company: string;
                position: string;
                startDate: string;
                endDate: string;
                current: string;
                description: string;
                descriptionPlaceholder: string;
                add: string;
            };
            education: {
                title: string;
                school: string;
                degree: string;
                field: string;
                startDate: string;
                endDate: string;
                current: string;
                description: string;
                add: string;
            };
            skills: {
                title: string;
                name: string;
                level: string;
                category: string;
                addSkill: string;
                addCategory: string;
                newCategoryPlaceholder: string;
                selectLevel: string;
                selectCategory: string;
                levels: {
                    beginner: string;
                    intermediate: string;
                    advanced: string;
                    expert: string;
                };
                defaultCategories: {
                    technical: string;
                    softSkills: string;
                    languages: string;
                    tools: string;
                };
            };
            projects: {
                title: string;
                name: string;
                description: string;
                technologies: string;
                link: string;
                linkPlaceholder: string;
                startDate: string;
                endDate: string;
                viewProject: string;
                add: string;
            };
            references: {
                title: string;
                name: string;
                position: string;
                company: string;
                email: string;
                phone: string;
                relationship: string;
                relationshipPlaceholder: string;
                hideForm: string;
                addReference: string;
                emailLabel: string;
                phoneLabel: string;
                relationshipLabel: string;
                add: string;
            };
            customSection: {
                title: string;
                sectionTitle: string;
                addSection: string;
                content: string;
                subtitle: string;
                date: string;
                addItem: string;
                cancel: string;
                deleteSection: string;
                enterSectionTitle: string;
                contentRequired: string;
                titleRequired: string;
            };
            certifications: {
                title: string;
                name: string;
                issuer: string;
                date: string;
                expiryDate: string;
                credentialId: string;
                credentialUrl: string;
                issued: string;
                expires: string;
                credentialIdLabel: string;
                verifyCredential: string;
                urlPlaceholder: string;
                add: string;
            };
            validation: {
                required: string;
                invalidEmail: string;
                invalidPhone: string;
            };
            navigation: {
                next: string;
                previous: string;
                finish: string;
                preview: string;
            };
        };
    };
    export default content;
}

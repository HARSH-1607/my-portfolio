// Dork's site profile and guide stops for Harsh's multi-page portfolio.
// Keep this before the hosted dork-embed.js script on every page.
(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const stop = (selector, label, description, aliases = []) => ({ selector, label, description, aliases });

  const pages = {
    'index.html': {
      description: 'Harsh Gautam\'s interactive game-development portfolio. Choose the standard portfolio, the explorable game world, or Unreal Engine projects.',
      targets: {
        welcome: stop('.start-banner', 'Welcome', 'This is the entrance to Harsh\'s interactive portfolio.', ['home', 'start']),
        standard: stop('a[href="console.html"]', 'Standard portfolio', 'Open the retro-console menu to explore projects, about, skills, and contact.', ['standard mode', 'portfolio']),
        game: stop('a[href="game.html"]', 'Game mode', 'Explore a small game world and discover portfolio sections through its chests.', ['play', 'game world']),
        unreal: stop('a[href="unreal_projects.html"]', 'Unreal projects', 'Watch Harsh\'s Unreal Engine cinematics and game trailers.', ['cinematics', 'trailers'])
      }
    },
    'console.html': {
      description: 'The standard retro-console menu for Harsh Gautam\'s portfolio, with links to projects, about, skills, and contact.',
      targets: {
        projects: stop('[data-target="projects.html"]', 'Projects', 'Browse Harsh\'s selected development projects.', ['work']),
        about: stop('[data-target="about.html"]', 'About', 'Read Harsh\'s background and experience.', ['bio', 'experience']),
        skills: stop('[data-target="skills.html"]', 'Skills', 'Explore game development and programming skills.', ['abilities']),
        contact: stop('[data-target="contact.html"]', 'Contact', 'Find Harsh\'s contact details and message form.', ['email', 'message'])
      }
    },
    'about.html': {
      description: 'Harsh Gautam\'s background, game-development focus, experience, education, and downloadable resume.',
      targets: {
        about: stop('.section__title', 'About Harsh', 'Harsh creates interactive experiences across web and game development.', ['bio', 'profile']),
        experience: stop('.timeline', 'Experience and education', 'Read about Harsh\'s internship and information technology studies.', ['education', 'history']),
        resume: stop('a[download]', 'Resume', 'Download Harsh\'s resume using this link.', ['cv'])
      }
    },
    'projects.html': {
      description: 'Selected projects from Harsh Gautam, including games and interactive development work.',
      targets: {
        projects: stop('.work-grid', 'Selected projects', 'Browse Harsh\'s project cards and follow their repository or demo links.', ['work', 'portfolio']),
        springstep: stop('.work-card.project-entry', 'SpringStep', 'A Unity platformer with spring mechanics and timing challenges.', ['platformer'])
      }
    },
    'skills.html': {
      description: 'Harsh Gautam\'s game design, Unity, Unreal Engine, programming, and technical skills.',
      targets: {
        gameSkills: stop('.skills:first-of-type', 'Game development and design', 'Skills include Unity, Unreal Engine, gameplay mechanics, level design, and game feel.', ['game design', 'unity', 'unreal']),
        technicalSkills: stop('.skills:last-of-type', 'Programming and technical skills', 'Browse Harsh\'s programming languages and technical practices.', ['programming', 'coding'])
      }
    },
    'contact.html': {
      description: 'Contact Harsh Gautam by email, professional links, or the portfolio contact form.',
      targets: {
        contact: stop('.content-panel', 'Contact details', 'Find Harsh\'s email, professional links, phone number, and location.', ['email', 'links']),
        message: stop('form[name="contact"]', 'Send a message', 'Fill out this contact form to send Harsh a message. Dork will not submit it for you.', ['form', 'get in touch'])
      }
    },
    'unreal_projects.html': {
      description: 'A carousel of Harsh Gautam\'s Unreal Engine cinematics and game trailers.',
      targets: {
        unreal: stop('.unreal-header', 'Unreal projects', 'This page showcases Harsh\'s Unreal Engine cinematic work.', ['cinematics']),
        videos: stop('.video-carousel', 'Video carousel', 'Choose a thumbnail or use the previous and next controls to watch a project video.', ['trailers', 'watch'])
      }
    },
    'game.html': {
      description: 'Harsh Gautam\'s explorable portfolio game world. Move with A/D or the arrow keys, jump with Space, and interact with E.',
      targets: {
        game: stop('#gameCanvas', 'Game world', 'Move with A/D or the arrow keys, jump with Space, and interact with E near a chest.', ['play', 'controls']),
        controls: stop('#mobile-controls', 'Touch controls', 'On touch devices, use these movement, jump, and interaction buttons.', ['mobile', 'buttons'])
      }
    },
    'about_rpg.html': {
      description: 'A game-style character profile with Harsh Gautam\'s background, internship, studies, and resume.',
      targets: {
        profile: stop('.content-area', 'Character profile', 'Read Harsh\'s background, experience, and education.', ['about', 'bio']),
        resume: stop('a[download]', 'Resume', 'Download Harsh\'s resume from this button.', ['cv'])
      }
    },
    'projects_rpg.html': {
      description: 'A game-style quest log of Harsh Gautam\'s projects with screenshots and links.',
      targets: {
        projects: stop('.quest-list', 'Project quest log', 'Explore Harsh\'s game and development projects in this quest log.', ['work', 'quests']),
        springstep: stop('.quest-item', 'SpringStep', 'A Unity platformer with spring mechanics.', ['platformer'])
      }
    },
    'skills_rpg.html': {
      description: 'A game-style overview of Harsh Gautam\'s game development, design, and programming skills.',
      targets: {
        gameSkills: stop('.skill-category:first-of-type', 'Game development and design', 'Explore Harsh\'s game development and design abilities.', ['game design']),
        technicalSkills: stop('.skill-category:last-of-type', 'Programming and technical', 'Explore Harsh\'s coding and technical skills.', ['programming'])
      }
    },
    'contact_rpg.html': {
      description: 'A game-style contact page with Harsh Gautam\'s email and a contact form.',
      targets: {
        contact: stop('.contact-info', 'Contact details', 'Find Harsh\'s email and GitHub profile here.', ['email']),
        message: stop('form[name="contact"]', 'Send a message', 'Use this form to send Harsh a message. Dork will not submit it for you.', ['form'])
      }
    }
  };

  const current = pages[page] || pages['index.html'];
  window.DorkEmbedConfig = {
    site: { title: 'Harsh Gautam\'s Portfolio', description: current.description },
    personality: {
      name: 'Dork',
      tone: 'playful',
      greeting: 'Hey! I\'m Dork, your guide to {site}. Ask me about this page or take a tour!',
      instructions: 'Keep the same curious, friendly personality on every page. Describe only the portfolio details and destinations provided; do not invent work history or claim to submit forms.'
    },
    targets: current.targets
  };
})();

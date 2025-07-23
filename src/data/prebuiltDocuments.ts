// Pre-built documents for users to select

export interface PrebuiltDocument {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'academic' | 'business' | 'technical';
  thumbnail?: string;
}

export const prebuiltDocuments: PrebuiltDocument[] = [
  {
    id: 'jesc102',
    title: 'JESC102 - Introduction to Electronics',
    description: 'Course materials for JESC102 covering fundamental electronics concepts.',
    category: 'academic',
    content: `# JESC102: Introduction to Electronics

## Course Description

This course introduces the fundamental concepts of electronics, including circuit analysis, semiconductor devices, and basic electronic systems. Students will learn about DC and AC circuits, diodes, transistors, operational amplifiers, and digital logic circuits.

## Course Objectives

By the end of this course, students will be able to:

1. Analyze DC and AC circuits using fundamental laws and theorems
2. Understand the operation of basic semiconductor devices
3. Design and analyze simple electronic circuits
4. Use laboratory equipment to build and test electronic circuits
5. Apply electronic principles to solve engineering problems

## Course Content

### Module 1: Circuit Fundamentals
- **Basic Concepts**: Voltage, current, power, energy
- **Circuit Elements**: Resistors, capacitors, inductors
- **Circuit Laws**: Ohm's Law, Kirchhoff's Laws
- **Circuit Analysis**: Series and parallel circuits, voltage and current division

### Module 2: AC Circuits
- **Sinusoidal Waveforms**: Frequency, period, amplitude, phase
- **Phasors**: Complex representation of sinusoidal signals
- **Impedance**: Resistive, capacitive, and inductive impedance
- **Frequency Response**: Filters and resonance

### Module 3: Semiconductor Devices
- **Diodes**: PN junction, diode characteristics, applications
- **Transistors**: BJT and FET operation, biasing, small-signal models
- **Operational Amplifiers**: Ideal op-amp, inverting and non-inverting configurations

### Module 4: Digital Electronics
- **Number Systems**: Binary, octal, hexadecimal
- **Logic Gates**: AND, OR, NOT, NAND, NOR, XOR
- **Combinational Logic**: Boolean algebra, Karnaugh maps
- **Sequential Logic**: Flip-flops, counters, registers

## Assessment

- **Laboratory Exercises (30%)**: Hands-on circuit building and testing
- **Assignments (20%)**: Problem-solving exercises
- **Midterm Exam (20%)**: Covering modules 1-2
- **Final Exam (30%)**: Comprehensive assessment

## Required Materials

1. **Textbook**: "Fundamentals of Electric Circuits" by Alexander and Sadiku, 6th Edition
2. **Laboratory Kit**: Basic electronic components and breadboard
3. **Software**: SPICE circuit simulation software

## Laboratory Schedule

| Week | Lab Topic | Equipment Needed |
|------|-----------|------------------|
| 1 | Introduction to Lab Equipment | Multimeter, Power Supply |
| 2 | Resistive Circuits | Resistors, Breadboard |
| 3 | Capacitive and Inductive Circuits | Capacitors, Inductors |
| 4 | Diode Characteristics | Diodes, Oscilloscope |
| 5 | Transistor Biasing | BJTs, FETs |
| 6 | Op-Amp Circuits | Op-Amps, Function Generator |
| 7 | Digital Logic Gates | Logic ICs, Logic Probe |

## Safety Guidelines

1. Always turn off power before modifying circuits
2. Wear appropriate safety equipment when required
3. Report any damaged equipment immediately
4. Follow all laboratory procedures and instructor guidance

## Additional Resources

- Online Circuit Simulator: https://www.circuitlab.com/
- Electronics Tutorials: https://www.electronics-tutorials.ws/
- Component Datasheets: https://www.alldatasheet.com/`
  },
  {
    id: 'custom1',
    title: 'Custom Document Example',
    description: 'This is an example of a manually added document.',
    category: 'academic',
    content: `# Custom Document

This is a custom document that you've manually added to the application.

## How to Add More Documents

1. Open the prebuiltDocuments.ts file
2. Add a new object to the array following this format
3. Make sure to include id, title, description, category, and content
4. Save the file and refresh the application

## Document Structure

You can use Markdown formatting in your documents:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- Lists like this one
- ## Headings for organization

Enjoy using your custom documents!`
  },
  {
    id: 'doc1',
    title: 'Introduction to Machine Learning',
    description: 'A beginner-friendly guide to machine learning concepts and applications.',
    category: 'academic',
    content: `# Introduction to Machine Learning

## What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. The primary aim is to allow computers to learn automatically without human intervention or assistance and adjust actions accordingly.

## Key Concepts

### Supervised Learning

Supervised learning algorithms build a mathematical model of a set of data that contains both the inputs and the desired outputs. Examples include:

- Classification: Identifying which category an object belongs to
- Regression: Predicting a continuous-valued attribute associated with an object

### Unsupervised Learning

Unsupervised learning algorithms take a set of data that contains only inputs, and find structure in the data, like grouping or clustering of data points. Examples include:

- Clustering: Grouping similar objects together
- Association: Finding rules that describe large portions of your data

### Reinforcement Learning

Reinforcement learning is concerned with how software agents ought to take actions in an environment so as to maximize some notion of cumulative reward.

## Common Algorithms

1. **Linear Regression**: Used for predicting a continuous value
2. **Logistic Regression**: Used for binary classification problems
3. **Decision Trees**: Tree-like model of decisions
4. **Random Forest**: Ensemble of decision trees
5. **Support Vector Machines**: Supervised learning models for classification and regression
6. **K-Means Clustering**: Unsupervised learning for clustering
7. **Neural Networks**: Computing systems inspired by biological neural networks

## Applications

Machine learning has been applied to various domains, including:

- **Healthcare**: Disease identification, patient monitoring
- **Finance**: Fraud detection, algorithmic trading
- **Retail**: Recommendation systems, inventory management
- **Transportation**: Self-driving cars, traffic prediction
- **Manufacturing**: Quality control, predictive maintenance

## Getting Started

To start with machine learning, you need:

1. **Data**: Clean, relevant data is the foundation of any ML project
2. **Tools**: Python libraries like scikit-learn, TensorFlow, or PyTorch
3. **Knowledge**: Understanding of statistics and programming
4. **Compute Resources**: Depending on the complexity of your models

## Conclusion

Machine learning is transforming industries by enabling systems to learn from data and make decisions with minimal human intervention. As the field continues to evolve, we can expect even more innovative applications and techniques to emerge.`
  },
  {
    id: 'doc2',
    title: 'Business Plan Template',
    description: 'A comprehensive business plan template for startups and small businesses.',
    category: 'business',
    content: `# Business Plan Template

## Executive Summary

[Company Name] is a [type of business] that [brief description of what your business does]. Our mission is to [company mission]. We aim to [primary goal] by providing [products/services] to [target market].

## Company Description

### Business Overview
[Company Name] was founded in [year] by [founder names]. We are a [business structure: LLC, corporation, etc.] based in [location].

### Mission Statement
[Your company's mission statement]

### Vision Statement
[Your company's vision statement]

### Core Values
- [Value 1]
- [Value 2]
- [Value 3]

## Market Analysis

### Industry Overview
[Description of the industry, its size, growth trends, and major players]

### Target Market
[Description of your ideal customer, including demographics, psychographics, and buying behaviors]

### Competitor Analysis
| Competitor | Strengths | Weaknesses | Market Share |
|------------|-----------|------------|--------------|
| [Name 1]   | [List]    | [List]     | [%]          |
| [Name 2]   | [List]    | [List]     | [%]          |

### SWOT Analysis
- **Strengths**: [Your company's internal strengths]
- **Weaknesses**: [Your company's internal weaknesses]
- **Opportunities**: [External opportunities your company can capitalize on]
- **Threats**: [External threats that could affect your business]

## Products and Services

### Product/Service Description
[Detailed description of what you sell or provide]

### Unique Selling Proposition
[What makes your product/service different from competitors]

### Pricing Strategy
[How you price your products/services and why]

### Future Development
[Plans for future products/services]

## Marketing and Sales Strategy

### Marketing Channels
- [Channel 1: e.g., Social Media]
- [Channel 2: e.g., Email Marketing]
- [Channel 3: e.g., Content Marketing]

### Sales Process
[Description of your sales funnel and process]

### Customer Retention
[Strategies for keeping customers]

## Operational Plan

### Location
[Physical location details or virtual business setup]

### Equipment and Technology
[List of necessary equipment and technology]

### Supply Chain
[Description of your supply chain]

### Quality Control
[Processes to ensure quality]

## Management and Organization

### Organizational Structure
[Description or chart of your company's structure]

### Management Team
- [Name, Title]: [Brief bio and qualifications]
- [Name, Title]: [Brief bio and qualifications]

### Advisory Board/Mentors
[List of advisors if applicable]

## Financial Plan

### Startup Costs
[Breakdown of initial costs to start the business]

### Revenue Projections
[Projected revenue for the next 3-5 years]

### Break-even Analysis
[When you expect to break even]

### Funding Requirements
[Amount of funding needed and how it will be used]

## Appendix

[Additional information, charts, research, etc.]`
  },
  {
    id: 'doc3',
    title: 'Web Development Guide',
    description: 'A comprehensive guide to modern web development practices and technologies.',
    category: 'technical',
    content: `# Web Development Guide

## Introduction to Web Development

Web development is the work involved in developing a website for the Internet or an intranet. It can range from developing a simple single static page of plain text to complex web applications, electronic businesses, and social network services.

## Front-End Development

Front-end web development is the practice of converting data to a graphical interface, through the use of HTML, CSS, and JavaScript, so that users can view and interact with that data.

### HTML (HyperText Markup Language)

HTML is the standard markup language for documents designed to be displayed in a web browser.

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html>
\`\`\`

### CSS (Cascading Style Sheets)

CSS is a style sheet language used for describing the presentation of a document written in HTML.

\`\`\`css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
}

h1 {
    color: #0066cc;
}
\`\`\`

### JavaScript

JavaScript is a programming language that enables interactive web pages and is an essential part of web applications.

\`\`\`javascript
// Simple function to change text
function changeText() {
    document.getElementById("demo").innerHTML = "Text changed!";
}

// Event listener
document.getElementById("button").addEventListener("click", changeText);
\`\`\`

### Front-End Frameworks

Popular front-end frameworks include:

- **React**: A JavaScript library for building user interfaces
- **Angular**: A platform for building mobile and desktop web applications
- **Vue.js**: A progressive framework for building user interfaces

## Back-End Development

Back-end development refers to the server-side of an application and everything that communicates between the database and the browser.

### Server-Side Languages

Common server-side languages include:

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine
- **Python**: Often used with frameworks like Django or Flask
- **Ruby**: Often used with Ruby on Rails
- **PHP**: Often used with Laravel or Symfony
- **Java**: Often used with Spring
- **C#**: Often used with ASP.NET

### Databases

Common databases include:

- **MySQL**: Open-source relational database
- **PostgreSQL**: Open-source object-relational database
- **MongoDB**: NoSQL document database
- **SQLite**: Self-contained, serverless SQL database engine

## Full-Stack Development

Full-stack development refers to the development of both front-end and back-end portions of an application. Full-stack developers have the ability to design complete web applications and websites.

## Web Development Tools

### Code Editors

- Visual Studio Code
- Sublime Text
- Atom
- WebStorm

### Version Control

- Git
- GitHub
- GitLab
- Bitbucket

### Package Managers

- npm (Node Package Manager)
- Yarn
- pip (for Python)
- Composer (for PHP)

## Web Development Best Practices

### Responsive Design

Ensure your website looks good on all devices by using responsive design techniques.

### Performance Optimization

Optimize your website's performance by minimizing HTTP requests, optimizing images, and using caching.

### Accessibility

Make your website accessible to all users, including those with disabilities.

### Security

Implement security best practices to protect your website from common vulnerabilities like SQL injection and cross-site scripting (XSS).

## Conclusion

Web development is a constantly evolving field with new technologies and best practices emerging regularly. Staying up-to-date with the latest trends and continuously learning is essential for success in this field.`
  }
];
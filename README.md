# 🚀 AutoMin – Regex to Minimized DFA Compiler

**AutoMin** is a mini compiler project developed as part of our **Compiler Design coursework**. The project demonstrates how a compiler internally processes **regular expressions** and converts them into efficient automata used for **lexical analysis**.

Instead of only studying the theory of automata, AutoMin provides a **step-by-step practical implementation** of the transformation pipeline:

Regular Expression → NFA → DFA → Minimized DFA

This helps visualize how compilers recognize tokens and optimize pattern matching.

---

# 📚 Project Motivation

While studying **Compiler Design**, we learn about:

- Regular Expressions  
- Nondeterministic Finite Automata (NFA)  
- Deterministic Finite Automata (DFA)  
- DFA Minimization  

However, these concepts are often taught **individually in theory**.

In real compilers, these components work **together inside the lexical analyzer**. Our goal with **AutoMin** is to bridge the gap between **theory and practical implementation** by building a system that demonstrates the full transformation pipeline.

---

# ⚙️ How AutoMin Works

AutoMin processes a regular expression in multiple stages:

## 1️⃣ Regular Expression Input

User enters a regex pattern.

Example:

```
(a|b)*abb
```

---

## 2️⃣ Regex → NFA

The system converts the regex into a **Non-Deterministic Finite Automaton** using standard construction techniques.

---

## 3️⃣ NFA → DFA

The NFA is transformed into a **Deterministic Finite Automaton** using the **subset construction algorithm**.

---

## 4️⃣ DFA Minimization

The DFA is optimized by removing redundant states to create a **Minimized DFA**, improving efficiency for pattern recognition.

---

# 🧠 Concepts Used

This project implements core topics from **Automata Theory and Compiler Design**:

- Regular Expressions
- Thompson’s Construction (Regex → NFA)
- Subset Construction Algorithm (NFA → DFA)
- DFA Minimization
- State Transition Tables
- Lexical Analyzer Fundamentals

---

# 🛠️ Tech Stack

### Frontend
- React.js  
- HTML5  
- CSS3  

### Backend / Logic
- JavaScript / TypeScript  

### Tools
- Node.js  
- Git  
- GitHub  

---

# 📂 Project Structure

```
AutoMin/
│
├── src/
│   ├── components/
│   ├── algorithms/
│   │   ├── regexToNFA
│   │   ├── nfaToDFA
│   │   └── minimizeDFA
│   ├── pages/
│   └── utils/
│
├── public/
├── package.json
└── README.md
```

---

# ▶️ Running the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/AutoMin.git
```

### 2️⃣ Go to Project Folder

```bash
cd AutoMin
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Run the Project

```bash
npm start
```

The application will start at:

```
http://localhost:3000
```

---

# 🎯 Features

- ✅ Convert **Regex → NFA**
- ✅ Convert **NFA → DFA**
- ✅ **Minimize DFA** automatically
- ✅ Step-by-step automata transformation
- ✅ Interactive visualization of automata

---

# 📸 Example Workflow

```
Input Regex:
(a|b)*abb

↓

Generated NFA

↓

Converted DFA

↓

Optimized Minimized DFA
```

---

# 🎓 Learning Outcomes

Through this project we learned:

- Practical implementation of automata algorithms  
- How lexical analyzers work inside compilers  
- State machine construction and optimization  
- Applying theoretical CS concepts to real systems  

---

# 👨‍💻 Contributors

Developed by **B.Tech CSE (6th Semester) students** as part of the **Compiler Design Project**.

- Ansh Karki  
- Divyanshi Kaushik  
- Harshita Pant  
- Bhaumik Negi  

---

# ⭐ Future Improvements

- Graphical automata visualization  
- Step-by-step DFA construction animation  
- Support for more complex regex operators  
- Export automata diagrams  

---

# 📜 License

This project is developed for **educational purposes** as part of a **Compiler Design academic project**.

---

⭐ If you found this project interesting, consider **starring the repository!**

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// ===========================
// //// Already Handled in ContactForm section
// =========================

// form.addEventListener("submit", event => {
//   event.preventDefault();
//   status.className = "";

//   if (!form.checkValidity()) {
//     status.textContent = "Please complete all required fields correctly.";
//     status.classList.add("error");
//     form.reportValidity();
//     return;
//   }

//   status.textContent = "Thank you. Your enquiry has been validated successfully.";
//   status.classList.add("success");
//   form.reset();
// });

document.getElementById("year").textContent = new Date().getFullYear();

/* =====================================================
   ASK AI
===================================================== */

const aiChatForm = document.getElementById("aiChatForm");
const aiPrompt = document.getElementById("aiPrompt");
const askAiButton = document.getElementById("askAiButton");
const chatMessages = document.getElementById("chatMessages");
const aiStatus = document.getElementById("aiStatus");
const clearChatButton = document.getElementById("clearChatButton");
const aiCharacterCount = document.getElementById("aiCharacterCount");
const suggestionButtons =
    document.querySelectorAll(".suggestion-button");

function updateQuestionSuggestions(searchText = "") {
    const normalizedSearch = searchText
        .toLowerCase()
        .trim();

    // When fewer than 3 characters are entered,
    // show only the first 3 questions.
    if (normalizedSearch.length < 3) {
        suggestionButtons.forEach((button, index) => {
            button.hidden = index >= 3;
        });

        return;
    }

    // After 3 characters, show only matching questions.
    suggestionButtons.forEach(button => {
        const question = button.textContent
            .toLowerCase()
            .trim();

        button.hidden =
            !question.includes(normalizedSearch);
    });
}    

// Initially display only 3 questions.
updateQuestionSuggestions();

const conversation = [];

function addChatMessage(role, content) {
    const messageElement = document.createElement("div");

    const roleClass =
        role === "user"
            ? "user-message"
            : "assistant-message";

    const roleLabel =
        role === "user"
            ? "You"
            : "AI Assistant";

    messageElement.className =
        `chat-message ${roleClass}`;

    const labelElement = document.createElement("div");
    labelElement.className = "message-label";
    labelElement.textContent = roleLabel;

    const contentElement = document.createElement("p");
    contentElement.textContent = content;

    messageElement.appendChild(labelElement);
    messageElement.appendChild(contentElement);

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageElement;
}

function setAiLoading(isLoading) {
    askAiButton.disabled = isLoading;
    aiPrompt.disabled = isLoading;

    askAiButton.textContent =
        isLoading ? "Thinking..." : "💬 Ask Our Assistant";

    if (isLoading) {
        aiStatus.textContent = "Generating response";
        aiStatus.className = "loading-dots";
    } else {
        // aiStatus.textContent = "";
        aiStatus.className = "";
    }
}

/* =====================================================
   ANDREW TECH AUTOMATED RESPONSES
===================================================== */

const andrewTechResponses = [
    {
        intent: "about",
        keywords: [
            "what is andrew tech",
            "about andrew tech",
            "tell me about andrew tech",
            "who is andrew tech",
            "what does andrew tech do",
            "company information",
            "about company"
        ],
        answer:
            "Andrew Tech provides custom software development, web applications, REST APIs, AI integration, business process automation and application support. We build maintainable solutions using technologies such as .NET, Python, React, Azure OpenAI and PowerShell."
    },
    {
        intent: "services",
        keywords: [
            "services",
            "what services do you provide",
            "what service do you provide",
            "services offered",
            "what do you offer",
            "how can you help",
            "what can you build",
            "your expertise"
        ],
        answer:
            "Andrew Tech provides custom software development, web applications and REST APIs, AI integration, business process automation and application support. Our solutions are designed around real business requirements."
    },
    {
        intent: "custom-software",
        keywords: [
            "custom software",
            "software development",
            "custom application",
            "develop an application",
            "build software",
            ".net application",
            "python application"
        ],
        answer:
            "Our Custom Software Development service focuses on maintainable .NET and Python applications designed around your business requirements. We can build new applications, enhance existing systems and integrate applications with external services."
    },
    {
        intent: "web-api",
        keywords: [
            "web application",
            "web development",
            "website development",
            "react",
            "rest api",
            "web api",
            "asp.net core",
            "api development",
            "frontend",
            "backend"
        ],
        answer:
            "Andrew Tech develops responsive web applications and secure ASP.NET Core REST APIs. We can work on frontend applications, backend services, database integration and API-based communication between systems."
    },
    {
        intent: "ai",
        keywords: [
            "ai",
            "artificial intelligence",
            "azure openai",
            "openai",
            "chatbot",
            "ai integration",
            "document intelligence",
            "summarization",
            "ask ai",
            "copilot"
        ],
        answer:
            "Our AI Integration service includes Azure OpenAI integration, AI assistants, document summarization, document intelligence and workflow automation. AI capabilities can be integrated into new or existing applications."
    },
    {
        intent: "automation",
        keywords: [
            "automation",
            "business process automation",
            "automate",
            "repetitive task",
            "powershell",
            "python automation",
            "workflow automation",
            "script",
            "scripting"
        ],
        answer:
            "Andrew Tech automates repetitive technical and business processes using Python, PowerShell, React applications and REST APIs. Automation can reduce manual effort, improve consistency and speed up routine operations."
    },
    {
        intent: "support",
        keywords: [
            "application support",
            "support",
            "maintenance",
            "production issue",
            "root cause analysis",
            "performance",
            "reliability",
            "bug fixing",
            "troubleshooting"
        ],
        answer:
            "Our Application Support service includes troubleshooting, root cause analysis, bug fixing, performance improvement and reliability enhancements for existing applications and services."
    },
    {
        intent: "technology",
        keywords: [
            "technology",
            "technologies",
            "tech stack",
            "programming language",
            "tools",
            "framework",
            "what technologies do you use"
        ],
        answer:
            "Andrew Tech works with technologies including C#, .NET, ASP.NET Core, Python, JavaScript, React, REST APIs, SQL, PowerShell, Azure services and Azure OpenAI."
    },
    {
        intent: "contact",

        keywords: [
            "how can i contact andrew tech",
            "how do i contact andrew tech",
            "how can i contact you",
            "contact andrew tech",
            "contact you",
            "get in touch",
            "request service",
            "start a project",
            "project discussion",
            "hire",
            "quotation",
            "quote",
            "estimate"
        ],

        answer:
            "You can contact Andrew Tech using the contact form on this website. " +
            "Please provide your name, email address, required service and a brief " +
            "description of your project, and we will get back to you."
    },
    {
        intent: "greeting",
        keywords: [
            "hello",
            "hi",
            "hey",
            "good morning",
            "good afternoon",
            "good evening"
        ],
        answer:
            "Hello! I am the Andrew Tech assistant. You can ask me about our software development, web application, API, AI integration, automation and application support services."
    },
    {
        intent: "thanks",
        keywords: [
            "thank you",
            "thanks",
            "thankyou",
            "appreciate"
        ],
        answer:
            "You're welcome. Please let me know which Andrew Tech service you would like to learn more about."
    }
];

function normalizeQuestion(value) {
    return value
        .toLowerCase()
        .replace(/[^\w\s.#]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function calculateMatchScore(question, keywords) {
    let score = 0;

    for (const keyword of keywords) {
        const normalizedKeyword = normalizeQuestion(keyword);

        // Highest score when the complete phrase appears
        if (question.includes(normalizedKeyword)) {
            score += normalizedKeyword.split(" ").length * 5;
            continue;
        }

        // Give partial credit for matching individual words
        const keywordWords = normalizedKeyword
            .split(" ")
            .filter(word => word.length > 2);

        for (const word of keywordWords) {
            if (question.includes(word)) {
                score += 1;
            }
        }
    }

    return score;
}

function getAutomatedResponse(prompt) {
    const normalizedQuestion = normalizeQuestion(prompt);

    // 1. First check whether the full question exactly matches a keyword
    for (const responseItem of andrewTechResponses) {
        const exactMatch = responseItem.keywords.some(keyword =>
            normalizedQuestion === normalizeQuestion(keyword)
        );

        if (exactMatch) {
            return responseItem.answer;
        }
    }

    // 2. Otherwise calculate the best partial match
    let bestResponse = null;
    let highestScore = 0;

    for (const responseItem of andrewTechResponses) {
        const score = calculateMatchScore(
            normalizedQuestion,
            responseItem.keywords
        );

        if (score > highestScore) {
            highestScore = score;
            bestResponse = responseItem;
        }
    }

    if (bestResponse && highestScore >= 2) {
        return bestResponse.answer;
    }

    return (
        "I can help with questions about Andrew Tech's " +
        "custom software development, web applications, REST APIs, " +
        "AI integration, business process automation and application support."
    );
}

async function sendAiQuestion(prompt) {
    conversation.push({
        role: "user",
        content: prompt
    });

    addChatMessage("user", prompt);
    setAiLoading(true);

    try {
        // Small delay makes the response feel more natural
        await new Promise(resolve => setTimeout(resolve, 500));

        const answer = getAutomatedResponse(prompt);

        conversation.push({
            role: "assistant",
            content: answer
        });

        addChatMessage("assistant", answer);
    }
    catch (error) {
        console.error("Automated response error:", error);

        addChatMessage(
            "assistant",
            "Sorry, I could not process your question. Please ask about Andrew Tech's services."
        );

        conversation.pop();
    }
    finally {
        setAiLoading(false);
        aiStatus.textContent = "";
        aiStatus.className = "";
        aiPrompt.focus();
    }
}

async function sendAiQuestion_bkb(prompt) {
    conversation.push({
        role: "user",
        content: prompt
    });

    addChatMessage("user", prompt);
    setAiLoading(true);

    try {
        const apiUrl =
            `${window.location.protocol}//${window.location.hostname}:5000/api/chat`; 
        const email = document.getElementById("email").value.trim();     
        const response = await fetch(
            apiUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    messages: conversation
                })
            }
        );

        const responseBody = await response.json();
        console.log(responseBody.visitorIp);

        if (!response.ok) {
            throw new Error(
                responseBody.message ||
                "The AI request failed."
            );
        }
        // document.getElementById("visitorIp").textContent =  responseBody.visitorIp ?? "Unknown";
        const answer = responseBody.answer;

        conversation.push({
            role: "assistant",
            content: answer
        });

        addChatMessage("assistant", answer);
    } catch (error) {
    console.error(error);

    // aiStatus.textContent =
    //     "Sorry, our AI assistant is temporarily unavailable. Please try again in a few minutes.";

    // aiStatus.className = "error";

        addChatMessage(
            "assistant",
            "⚠️ Sorry, our AI assistant is temporarily unavailable. Please try again later."
        );

        conversation.pop();

        aiStatus.textContent = "";
        aiStatus.className = "";
        
    } finally {
        setAiLoading(false);
        aiPrompt.focus();
    }
}

aiChatForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const prompt = aiPrompt.value.trim();

    if (!prompt) {
        aiStatus.textContent =
            "Please enter a question.";

        aiStatus.className = "error";
        return;
    }

    aiPrompt.value = "";
    aiCharacterCount.textContent = "0 / 2000";

    await sendAiQuestion(prompt);
});

// aiPrompt?.addEventListener("input", () => {
//     aiCharacterCount.textContent =
//         `${aiPrompt.value.length} / 2000`;
// });

aiPrompt?.addEventListener("input", () => {
    aiCharacterCount.textContent =
        `${aiPrompt.value.length} / 2000`;

    updateQuestionSuggestions(aiPrompt.value);
});

aiPrompt?.addEventListener("keydown", (event) => {
    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {
        event.preventDefault();
        aiChatForm.requestSubmit();
    }
});

suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        aiPrompt.value = button.textContent.trim();

        aiCharacterCount.textContent =
            `${aiPrompt.value.length} / 2000`;

        aiPrompt.focus();
    });
});


// =====================
// Contact Form
// =====================

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm?.addEventListener("submit", async event => {
    event.preventDefault();

    formStatus.className = "";

    if (!contactForm.checkValidity()) {
        formStatus.textContent =
            "Please complete all required fields correctly.";

        formStatus.classList.add("error");
        contactForm.reportValidity();
        return;
    }

    const submitButton =
        contactForm.querySelector('button[type="submit"]');

    const originalButtonText = submitButton.textContent;

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        formStatus.textContent =
            "Sending your enquiry...";

        const formData = new FormData(contactForm);

        // Replace this with your actual Web3Forms access key.
        formData.append(
            "access_key",
            "5935b952-5761-4d0a-b107-1d709fcb53f0"
        );

        formData.append(
            "subject",
            "New Andrew Tech Website Enquiry"
        );

        formData.append(
            "from_name",
            "Andrew Tech Website"
        );

        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "Unable to send your enquiry."
            );
        }

        formStatus.textContent =
            "Thank you. Your enquiry has been sent successfully.";

        formStatus.classList.add("success");

        contactForm.reset();
    }
    catch (error) {
        console.error(
            "Web3Forms submission error:",
            error
        );

        formStatus.textContent =
            error.message ||
            "Sorry, we could not send your enquiry. Please try again.";

        formStatus.classList.add("error");
    }
    finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

clearChatButton?.addEventListener("click", () => {
    conversation.length = 0;

    chatMessages.innerHTML = "";

    addChatMessage(
        "assistant",
        "Conversation cleared. What would you like to ask?"
    );

    aiStatus.textContent = "";
    aiStatus.className = "";
});
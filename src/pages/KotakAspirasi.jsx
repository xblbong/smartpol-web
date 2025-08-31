import { useEffect, useRef, useState } from "react";
import FooterComponent from "../components/layouts/FooterComponent";
import { NavbarDashboardComponent } from "../components/layouts/NavbarDashboardComponent";

function KotakAspirasi() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(1);
  const [currentVoice, setCurrentVoice] = useState("female");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatMessagesRef = useRef(null);
  const avatarVideoRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null); // For SpeechRecognition API

  // Dummy avatars and politician data - replace with actual data or props
  const avatars = [
    {
      id: 1,
      src: "/images/avatar1.jpg",
      name: "Dr. Budi Santoso, M.Si",
      title: "Anggota DPR RI Dapil Malang",
    },
    {
      id: 2,
      src: "/images/avatar2.jpg",
      name: "Ir. Siti Aminah, M.Eng",
      title: "Anggota DPR RI Dapil Jakarta",
    },
    {
      id: 3,
      src: "/images/avatar3.jpg",
      name: "Prof. Adi Wijaya, Ph.D",
      title: "Anggota DPR RI Dapil Surabaya",
    },
    {
      id: 4,
      src: "/images/avatar4.jpg",
      name: "Dra. Maya Sari, S.H",
      title: "Anggota DPR RI Dapil Bandung",
    },
  ];

  // --- Speech Recognition Setup ---
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "id-ID";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessageInput(transcript);
        sendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopRecording();
        addMessage(
          "Maaf, terjadi kesalahan dalam pengenalan suara. Silakan coba lagi.",
          "bot",
          currentAvatar
        );
      };

      recognitionRef.current.onend = () => {
        stopRecording();
      };
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentAvatar]); // Dependency on currentAvatar to update bot's avatar in messages

  // --- Voice Synthesis Setup ---
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      setAvailableVoices(speechSynthesisRef.current.getVoices());
    };

    loadVoices(); // Load voices initially

    if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
      speechSynthesisRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
        speechSynthesisRef.current.onvoiceschanged = null; // Clean up event listener
      }
    };
  }, []);

  useEffect(() => {
    const selectVoice = () => {
      let indonesianVoices = availableVoices.filter((voice) =>
        voice.lang.startsWith("id")
      );

      if (indonesianVoices.length === 0) {
        // Fallback to English if no Indonesian voices
        indonesianVoices = availableVoices.filter((voice) =>
          voice.lang.startsWith("en")
        );
      }

      if (indonesianVoices.length > 0) {
        if (currentVoice === "female") {
          setSelectedVoice(
            indonesianVoices.find(
              (v) =>
                v.name.toLowerCase().includes("female") ||
                v.name.includes("Wanita")
            ) || indonesianVoices[0]
          );
        } else {
          setSelectedVoice(
            indonesianVoices.find(
              (v) =>
                v.name.toLowerCase().includes("male") || v.name.includes("Pria")
            ) || indonesianVoices[Math.min(1, indonesianVoices.length - 1)]
          );
        }
      } else {
        setSelectedVoice(availableVoices[0] || null);
      }
    };
    if (availableVoices.length > 0) {
      selectVoice();
    }
  }, [availableVoices, currentVoice]);

  // --- Chat Logic ---
  const addMessage = (text, sender, avatarId = null) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { text, sender, avatarId, timestamp: new Date() },
    ]);
    // Scroll to bottom
    setTimeout(() => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTo({
          top: chatMessagesRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  useEffect(() => {
    // Initial bot message
    addMessage(
      "Selamat datang! Saya siap mendengarkan aspirasi Anda. Silakan berbicara atau ketik pesan Anda.",
      "bot",
      currentAvatar
    );
  }, []); // Only on initial mount

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      addMessage(
        "Maaf, browser Anda tidak mendukung pengenalan suara.",
        "bot",
        currentAvatar
      );
      return;
    }
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const sendMessage = async (message = null) => {
    const text = message || messageInput.trim();
    if (!text) return;

    stopTextToSpeech();
    addMessage(text, "user");
    setMessageInput("");
    setIsLoading(true);

    try {
      // Simulate API call
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          const dummyResponses = [
            "Terima kasih atas aspirasi Anda. Kami akan mempertimbangkan masukan ini untuk pembahasan selanjutnya.",
            "Baik, kami memahami kekhawatiran Anda. Kami akan segera menindaklanjuti hal ini.",
            "Aspirasi Anda telah kami catat. Kami berkomitmen untuk mewujudkan perubahan positif.",
            "Saran yang sangat baik! Kami akan membawa ini ke rapat komisi terkait.",
          ];
          const botResponse =
            dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
          // Simulate video URL if needed, for now it's just a placeholder
          const videoUrl = ""; // `https://example.com/avatar_speaking_avatar${currentAvatar}.mp4`
          resolve({
            success: true,
            response: botResponse,
            video_url: videoUrl,
          });
        }, 1500)
      ); // Simulate network delay

      if (response.success) {
        addMessage(response.response, "bot", currentAvatar);
        setLastResponse(response.response);
        // if (response.video_url) {
        //     // const ttsPromise = playTextToSpeech(response.response);
        //     // const videoPromise = playAvatarResponse(response.video_url);
        //     // await Promise.all([ttsPromise, videoPromise]);
        //     // For now, just play TTS
        //     await playTextToSpeech(response.response);
        // } else {
        await playTextToSpeech(response.response);
        // }
      } else {
        throw new Error(response.message || "Terjadi kesalahan pada server.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage(
        `Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi.`,
        "bot",
        currentAvatar
      );
    } finally {
      setIsLoading(false);
      setMessageInput(""); // Clear input after processing
    }
  };

  const playTextToSpeech = (text) => {
    return new Promise((resolve, reject) => {
      if (!speechSynthesisRef.current) {
        console.warn("Speech Synthesis not supported.");
        return resolve();
      }
      stopTextToSpeech();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.9;
      utterance.pitch = currentVoice === "female" ? 1.1 : 0.8;
      utterance.volume = 1;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      const onEndOrError = (event) => {
        setIsSpeaking(false);
        if (event.type === "error") {
          console.error("Speech synthesis error:", event.error);
          reject(event.error);
        } else {
          resolve();
        }
      };
      utterance.onend = onEndOrError;
      utterance.onerror = onEndOrError;
      speechSynthesisRef.current.speak(utterance);
    });
  };

  const stopTextToSpeech = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleTextToSpeech = () => {
    if (isSpeaking) {
      stopTextToSpeech();
    } else if (lastResponse) {
      playTextToSpeech(lastResponse);
    }
  };

  // --- Avatar & Voice Selection ---
  const switchAvatar = (avatarId) => {
    setCurrentAvatar(avatarId);
    // Reset video if a new avatar is chosen
    if (avatarVideoRef.current) {
      avatarVideoRef.current.pause();
      avatarVideoRef.current.src = "";
      avatarVideoRef.current.load();
    }
  };

  const switchVoice = (voiceType) => {
    setCurrentVoice(voiceType);
  };

  const currentPolitician = avatars.find(
    (avatar) => avatar.id === currentAvatar
  );
  return (
    <>
      <NavbarDashboardComponent />
      {/* Section Content  Start*/}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 pt-8 md:pt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Kotak Aspirasi
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              Digital
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sampaikan aspirasi Anda langsung kepada wakil rakyat melalui chatbot
            interaktif dengan avatar politikus yang responsif.
          </p>
        </div>

        <div className="my-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Speech-to-Text
            </h3>
            <p className="text-gray-600 text-sm">
              Teknologi pengenalan suara untuk mengubah ucapan Anda menjadi teks
              secara akurat.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Text-to-Speech
            </h3>
            <p className="text-gray-600 text-sm">
              Konversi teks respons dari AI menjadi suara yang natural dan mudah
              didengarkan.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Avatar Lip-Sync
            </h3>
            <p className="text-gray-600 text-sm">
              Avatar bergerak dan berbicara sesuai audio untuk pengalaman
              interaktif yang lebih hidup.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mt-12 mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 h-auto lg:h-[85vh] lg:min-h-[700px] lg:max-h-[850px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Chat Section */}
              <div className="flex flex-col h-[90vh] lg:h-full bg-white order-2 lg:order-1">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md z-10">
                  <h3 className="text-lg font-semibold">
                    Chat dengan Wakil Rakyat
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Gunakan suara atau ketik pesan Anda di bawah ini
                  </p>
                </div>

                <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Pilih Avatar & Suara:
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-4 gap-2">
                        {avatars.map((avatar) => (
                          <button
                            key={avatar.id}
                            onClick={() => switchAvatar(avatar.id)}
                            className={`rounded-lg p-1 transition-all duration-200 ${
                              currentAvatar === avatar.id
                                ? "ring-2 ring-blue-500 ring-offset-1"
                                : "ring-2 ring-transparent hover:ring-blue-400"
                            }`}
                          >
                            <img
                              src={avatar.src}
                              alt={`Avatar ${avatar.id}`}
                              className="w-full h-auto rounded-md object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-2 h-full">
                        <button
                          onClick={() => switchVoice("female")}
                          className={`voice-option border-2 ${
                            currentVoice === "female"
                              ? "border-blue-500"
                              : "border-gray-300"
                          } rounded-lg p-2 hover:bg-gray-50 transition-all duration-200 text-xs flex flex-col justify-center`}
                          data-voice="female"
                        >
                          <span className="block text-center font-medium">
                            Suara Wanita
                          </span>
                          <span className="block text-center text-gray-500">
                            Indonesia
                          </span>
                        </button>
                        <button
                          onClick={() => switchVoice("male")}
                          className={`voice-option border-2 ${
                            currentVoice === "male"
                              ? "border-blue-500"
                              : "border-gray-300"
                          } rounded-lg p-2 hover:bg-gray-50 transition-all duration-200 text-xs flex flex-col justify-center`}
                          data-voice="male"
                        >
                          <span className="block text-center font-medium">
                            Suara Pria
                          </span>
                          <span className="block text-center text-gray-500">
                            Indonesia
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div
                    ref={chatMessagesRef}
                    className="h-full overflow-y-auto p-4 space-y-4 bg-gray-100"
                    style={{
                      backgroundImage:
                        "radial-gradient(#d1d5db 0.5px, transparent 0.5px)",
                      backgroundSize: "10px 10px",
                    }}
                  >
                    <div id="messages-container">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 ${
                            msg.sender === "user" ? "justify-end" : ""
                          }`}
                        >
                          {msg.sender === "bot" && (
                            <img
                              src={
                                avatars.find((a) => a.id === msg.avatarId)
                                  ?.src || `/images/avatar1.jpg`
                              }
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          <div
                            className={`rounded-t-lg p-3 shadow-sm max-w-md break-words ${
                              msg.sender === "user"
                                ? "bg-blue-600 text-white rounded-bl-lg"
                                : "bg-white text-gray-800 rounded-br-lg"
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <span
                              className={`text-xs mt-1 block ${
                                msg.sender === "user"
                                  ? "text-blue-100 text-right"
                                  : "text-gray-500"
                              }`}
                            >
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleVoiceRecording}
                      className={`flex-shrink-0 text-white p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isRecording
                          ? "bg-red-700 animate-pulse focus:ring-red-700"
                          : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                      }`}
                      title="Mulai Merekam Suara"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>

                    <input
                      type="text"
                      id="message-input"
                      placeholder="Ketik aspirasi Anda di sini..."
                      className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={isLoading}
                    />

                    <button
                      onClick={toggleTextToSpeech}
                      className={`flex-shrink-0 text-white p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isSpeaking
                          ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                          : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                      }`}
                      title={
                        isSpeaking ? "Hentikan Suara" : "Putar Ulang Suara"
                      }
                      disabled={isLoading || !lastResponse}
                    >
                      {isSpeaking ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => sendMessage()}
                      className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      title="Kirim Pesan"
                      disabled={isLoading || !messageInput.trim()}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.429a1 1 0 001.17-1.409l-7-14z"></path>
                      </svg>
                    </button>
                  </div>
                  {isRecording && (
                    <div id="recording-indicator" className="mt-2 text-center">
                      <div className="inline-flex items-center space-x-2 text-red-600">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                          Sedang merekam...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Display Section */}
              <div className="bg-white flex items-center justify-center relative order-1 lg:order-2 h-[50vh] lg:h-full">
                <div
                  id="avatar-container"
                  className="w-full h-full flex items-center justify-center"
                >
                  <div
                    className={`text-center p-8 ${
                      !avatarVideoRef.current?.src ? "" : "hidden"
                    }`}
                  >
                    <img
                      src={currentPolitician?.src}
                      alt="Avatar Politikus"
                      className={`w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-blue-300 shadow-lg shadow-blue-500/20 mx-auto mb-4 transition-all duration-300 ${
                        isSpeaking ? "ring-4 ring-green-500" : ""
                      }`}
                    />
                    <p className="text-gray-900 text-xl font-medium mt-4">
                      {currentPolitician?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {currentPolitician?.title}
                    </p>
                  </div>

                  <video
                    ref={avatarVideoRef}
                    className={`w-full h-full object-cover absolute top-0 left-0 ${
                      avatarVideoRef.current?.src ? "" : "hidden"
                    }`}
                    autoplay
                    muted
                    playsInline
                    controls={false} // Hide controls
                    onEnded={() => {
                      if (avatarVideoRef.current) {
                        avatarVideoRef.current.classList.add("hidden");
                        avatarVideoRef.current.src = "";
                        avatarVideoRef.current.load();
                      }
                    }}
                  ></video>
                </div>

                {isLoading && (
                  <div
                    id="loading-indicator"
                    className="absolute inset-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-20"
                  >
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>AI sedang memproses respons...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section Content  End*/}
      <FooterComponent />
    </>
  );
}

export default KotakAspirasi;

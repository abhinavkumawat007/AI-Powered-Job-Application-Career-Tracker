import { useState } from "react";
import axios from "axios";

import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Search,
  Check,
  X,
  Briefcase,
} from "lucide-react";


function Resume() {
  // ======================================================
  // RESUME ANALYZER STATE
  // ======================================================

  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");


  // ======================================================
  // JOB MATCH STATE
  // ======================================================

  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [jobMatch, setJobMatch] = useState(null);
  const [jobMatchError, setJobMatchError] = useState("");

  // Save Job Match as Application
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savingApplication, setSavingApplication] = useState(false);
  const [saveApplicationError, setSaveApplicationError] = useState("");
  const [saveApplicationSuccess, setSaveApplicationSuccess] = useState("");

  const [applicationForm, setApplicationForm] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    jobUrl: "",
    notes: "",
  });


  // ======================================================
  // RESUME IMPROVEMENT STATE
  // ======================================================

  const [improveText, setImproveText] = useState("");
  const [improving, setImproving] = useState(false);
  const [improvement, setImprovement] = useState(null);
  const [improveError, setImproveError] = useState("");


  // ======================================================
  // FILE CHANGE
  // ======================================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please upload a PDF file.");
      return;
    }

    setFile(selectedFile);

    // Clear old results when a new resume is selected
    setAnalysis(null);
    setJobMatch(null);

    setError("");
    setJobMatchError("");
  };


  // ======================================================
  // RESUME ANALYSIS
  // ======================================================

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "http://localhost:5001/api/resume/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "RESUME ANALYSIS RESULT:",
        response.data.analysis
      );

      setAnalysis(response.data.analysis);

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const resumeScoreKey = storedUser.id
        ? `resumeScore_${storedUser.id}`
        : "resumeScore";

      localStorage.setItem(
        resumeScoreKey,
        String(response.data.analysis.atsScore || 0)
      );

    } catch (error) {
      console.error(
        "Resume analysis failed:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to analyze resume."
      );

    } finally {
      setAnalyzing(false);
    }
  };


  // ======================================================
  // JOB MATCH
  // ======================================================

  const handleJobMatch = async () => {
    if (!file) {
      setJobMatchError(
        "Please upload your resume first."
      );
      return;
    }

    if (!jobDescription.trim()) {
      setJobMatchError(
        "Please paste a job description."
      );
      return;
    }

    try {
      setMatching(true);
      setJobMatchError("");
      setJobMatch(null);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("resume", file);
      formData.append(
        "jobDescription",
        jobDescription
      );

      const response = await axios.post(
        "http://localhost:5001/api/job-match/match",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "JOB MATCH RESULT:",
        response.data.result
      );

      setJobMatch(response.data.result);

    } catch (error) {
      console.error(
        "Job match failed:",
        error
      );

      setJobMatchError(
        error.response?.data?.message ||
        "Failed to analyze job match."
      );

    } finally {
      setMatching(false);
    }
  };

  // ======================================================
  // SAVE JOB AS APPLICATION
  // ======================================================

  const handleSaveApplication = async (e) => {
    e.preventDefault();

    if (!applicationForm.company.trim()) {
      setSaveApplicationError(
        "Company name is required."
      );
      return;
    }

    if (!applicationForm.role.trim()) {
      setSaveApplicationError(
        "Job role is required."
      );
      return;
    }

    try {
      setSavingApplication(true);
      setSaveApplicationError("");
      setSaveApplicationSuccess("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5001/api/applications",
        {
          company: applicationForm.company.trim(),
          role: applicationForm.role.trim(),
          location: applicationForm.location.trim(),
          salary: applicationForm.salary.trim(),
          jobUrl: applicationForm.jobUrl.trim(),
          notes: applicationForm.notes.trim(),

          status: "Applied",
          source: "Job Match",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Application created:",
        response.data.application
      );

      setSaveApplicationSuccess(
        "Application added successfully."
      );

      setApplicationForm({
        company: "",
        role: "",
        location: "",
        salary: "",
        jobUrl: "",
        notes: "",
      });

    } catch (error) {
      console.error(
        "Failed to save application:",
        error
      );

      setSaveApplicationError(
        error.response?.data?.message ||
        "Failed to add application."
      );

    } finally {
      setSavingApplication(false);
    }
  };


  // ======================================================
  // AI RESUME IMPROVEMENT
  // ======================================================

  const handleImproveResume = async () => {
    if (!improveText.trim()) {
      setImproveError(
        "Enter a resume section or bullet point first."
      );
      return;
    }

    try {
      setImproving(true);
      setImproveError("");
      setImprovement(null);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5001/api/resume-improve/improve",
        {
          resumeText:
            analysis?.summary || "",
          section: improveText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImprovement(
        response.data.result
      );

    } catch (error) {
      console.error(
        "Resume improvement failed:",
        error
      );

      setImproveError(
        error.response?.data?.message ||
        "Failed to improve resume."
      );

    } finally {
      setImproving(false);
    }
  };


  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="border-b border-white/10 px-6 py-6 lg:px-10">

        <div className="mx-auto max-w-[1400px]">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              <FileText size={19} />
            </div>

            <div>
              <p className="text-xs text-zinc-600">
                Career intelligence
              </p>

              <h1 className="text-xl font-semibold">
                Resume Analyzer
              </h1>
            </div>

          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Upload your resume and get AI-powered
            feedback, ATS analysis, job matching,
            and personalized improvement suggestions.
          </p>

        </div>

      </header>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">


        {/* =================================================
            RESUME UPLOAD
        ================================================= */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
              <Upload size={24} />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Upload your resume
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Upload a PDF resume to analyze
              your ATS compatibility and compare
              it against job descriptions.
            </p>


            <label className="mt-7 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 transition hover:border-white/30 hover:bg-white/[0.04]">

              <Upload
                size={24}
                className="text-zinc-500"
              />

              <p className="mt-4 text-sm font-medium">

                {file
                  ? file.name
                  : "Click to upload your resume"}

              </p>

              <p className="mt-2 text-xs text-zinc-600">
                PDF files only
              </p>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>


            {file && (
              <>

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Sparkles size={17} />

                  {analyzing
                    ? "Analyzing..."
                    : "Analyze Resume"}

                </button>


                {error && (
                  <p className="mt-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

              </>
            )}

          </div>

        </section>


        {/* =================================================
            RESUME ANALYSIS
        ================================================= */}

        {analysis && (

          <section className="mt-6 space-y-6">


            {/* ANALYSIS HEADER */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                  <Sparkles size={18} />
                </div>

                <div>

                  <h2 className="font-semibold">
                    Resume Analysis
                  </h2>

                  <p className="text-xs text-zinc-500">
                    AI-powered resume feedback
                  </p>

                </div>

              </div>


              <div className="mt-6 grid gap-5 lg:grid-cols-[220px_1fr]">


                {/* ATS SCORE */}

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

                  <p className="text-sm text-zinc-500">
                    ATS Score
                  </p>

                  <div className="mt-2 flex items-baseline">

                    <span className="text-5xl font-semibold">
                      {analysis.atsScore ?? 0}
                    </span>

                    <span className="ml-1 text-lg text-zinc-600">
                      /100
                    </span>

                  </div>

                </div>


                {/* SUMMARY */}

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

                  <p className="text-sm font-medium">
                    Summary
                  </p>

                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    {analysis.summary}
                  </p>

                </div>

              </div>

            </div>


            {/* STRENGTHS + WEAKNESSES */}

            {(analysis.strengths?.length > 0 ||
              analysis.weaknesses?.length > 0) && (

                <div className="grid gap-6 md:grid-cols-2">


                  {/* STRENGTHS */}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                        <CheckCircle2 size={17} />
                      </div>

                      <h3 className="font-semibold">
                        Strengths
                      </h3>

                    </div>


                    <div className="mt-5 space-y-3">

                      {analysis.strengths?.map(
                        (item, index) => (

                          <div
                            key={index}
                            className="flex gap-3"
                          >

                            <span className="mt-1 text-xs">
                              ✓
                            </span>

                            <p className="text-sm leading-6 text-zinc-400">
                              {item}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>


                  {/* WEAKNESSES */}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                        <X size={17} />
                      </div>

                      <h3 className="font-semibold">
                        Areas to Improve
                      </h3>

                    </div>


                    <div className="mt-5 space-y-3">

                      {analysis.weaknesses?.map(
                        (item, index) => (

                          <div
                            key={index}
                            className="flex gap-3"
                          >

                            <span className="mt-1 text-xs text-zinc-500">
                              ×
                            </span>

                            <p className="text-sm leading-6 text-zinc-400">
                              {item}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>
              )}


            {/* DETECTED SKILLS */}

            {analysis.skills?.length > 0 && (

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <h3 className="font-semibold">
                  Detected Skills
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">

                  {analysis.skills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

            )}

          </section>
        )}


        {/* =================================================
            JOB DESCRIPTION MATCHER
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              <Search size={18} />
            </div>

            <div>

              <h2 className="font-semibold">
                Job Description Matcher
              </h2>

              <p className="text-xs text-zinc-500">
                Compare your resume against
                a specific job description.
              </p>

            </div>

          </div>


          <div className="mt-6">

            <label className="text-sm font-medium">
              Job Description
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
              placeholder="Paste the job description here..."
              className="mt-3 min-h-48 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

          </div>


          {jobMatchError && (
            <p className="mt-3 text-sm text-red-400">
              {jobMatchError}
            </p>
          )}


          <button
            onClick={handleJobMatch}
            disabled={matching}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Sparkles size={17} />

            {matching
              ? "Analyzing Job Match..."
              : "Analyze Job Match"}

          </button>

        </section>


        {/* =================================================
            JOB MATCH RESULT
        ================================================= */}

        {jobMatch && (

          <section className="mt-6 space-y-6">


            {/* SCORE + ASSESSMENT */}

            <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">

              {/* SCORE */}

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

                <p className="text-sm text-zinc-500">
                  Match Score
                </p>

                <div className="mt-2 flex items-baseline">

                  <span className="text-5xl font-semibold">
                    {jobMatch.matchScore ?? 0}
                  </span>

                  <span className="ml-1 text-lg text-zinc-600">
                    /100
                  </span>

                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          Number(jobMatch.matchScore || 0)
                        )
                      )}%`,
                    }}
                  />

                </div>

                <div className="mt-4">

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
                    AI: {jobMatch.provider || "Rule-based"}
                  </span>

                </div>

              </div>


              {/* ASSESSMENT */}

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

                <p className="text-sm font-medium">
                  Assessment
                </p>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {jobMatch.summary ||
                    "No assessment available."}
                </p>

              </div>

            </div>


            {/* ADD TO APPLICATIONS */}

            <div className="mt-6 flex justify-end">

              <button
                onClick={() => {
                  setShowSaveModal(true);
                  setSaveApplicationError("");
                  setSaveApplicationSuccess("");
                }}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                <Briefcase size={17} />
                Add to Applications
              </button>

            </div>


            {/* =================================================
                SCORE BREAKDOWN
            ================================================= */}

            {jobMatch.breakdown && (

              <div className="grid gap-6 md:grid-cols-2">


                {/* REQUIRED */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="font-semibold">
                        Required Skills
                      </h3>

                      <p className="mt-1 text-xs text-zinc-500">
                        Core requirements
                      </p>

                    </div>

                    <span className="text-xl font-semibold">
                      {
                        jobMatch.breakdown
                          .required
                          .percentage
                      }%
                    </span>

                  </div>


                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-white transition-all duration-700"
                      style={{
                        width: `${jobMatch.breakdown
                          .required
                          .percentage
                          }%`,
                      }}
                    />

                  </div>


                  <div className="mt-3 flex justify-between text-xs text-zinc-500">

                    <span>
                      {
                        jobMatch.breakdown
                          .required.matched
                      }{" "}
                      of{" "}
                      {
                        jobMatch.breakdown
                          .required.total
                      }{" "}
                      matched
                    </span>

                    <span>
                      +
                      {
                        jobMatch.breakdown
                          .required
                          .contribution
                      }{" "}
                      pts
                    </span>

                  </div>

                </div>


                {/* PREFERRED */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="font-semibold">
                        Preferred Skills
                      </h3>

                      <p className="mt-1 text-xs text-zinc-500">
                        Additional requirements
                      </p>

                    </div>

                    <span className="text-xl font-semibold">
                      {
                        jobMatch.breakdown
                          .preferred
                          .percentage
                      }%
                    </span>

                  </div>


                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-white transition-all duration-700"
                      style={{
                        width: `${jobMatch.breakdown
                          .preferred
                          .percentage
                          }%`,
                      }}
                    />

                  </div>


                  <div className="mt-3 flex justify-between text-xs text-zinc-500">

                    <span>
                      {
                        jobMatch.breakdown
                          .preferred.matched
                      }{" "}
                      of{" "}
                      {
                        jobMatch.breakdown
                          .preferred.total
                      }{" "}
                      matched
                    </span>

                    <span>
                      +
                      {
                        jobMatch.breakdown
                          .preferred
                          .contribution
                      }{" "}
                      pts
                    </span>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                MATCHED + MISSING WITH EVIDENCE
            ================================================= */}

            <div className="grid gap-6 lg:grid-cols-2">


              {/* MATCHED */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                    <Check size={17} />
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Matched Skills
                    </h3>

                    <p className="text-xs text-zinc-500">
                      Skills found in your resume
                    </p>

                  </div>

                </div>


                <div className="mt-5 space-y-3">

                  {jobMatch.matchedSkillEvidence?.length > 0 ? (

                    jobMatch.matchedSkillEvidence.map(
                      (item, index) => (

                        <div
                          key={`${item.skill}-${index}`}
                          className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                        >

                          <div className="flex items-center gap-2">

                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
                              ✓
                            </span>

                            <span className="text-sm font-medium text-zinc-200">
                              {item.skill}
                            </span>

                          </div>


                          <p className="mt-2 pl-7 text-xs leading-5 text-zinc-500">
                            {item.evidence}
                          </p>

                        </div>

                      )
                    )

                  ) : jobMatch.matchedSkills?.length > 0 ? (

                    <div className="flex flex-wrap gap-2">

                      {jobMatch.matchedSkills.map(
                        (skill, index) => (

                          <span
                            key={index}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-sm text-zinc-600">
                      No matching skills detected.
                    </p>

                  )}

                </div>

              </div>


              {/* MISSING */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <X size={17} />
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Missing Skills
                    </h3>

                    <p className="text-xs text-zinc-500">
                      Skills not explicitly demonstrated
                    </p>

                  </div>

                </div>


                <div className="mt-5 space-y-3">

                  {jobMatch.missingSkillEvidence?.length > 0 ? (

                    jobMatch.missingSkillEvidence.map(
                      (item, index) => (

                        <div
                          key={`${item.skill}-${index}`}
                          className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                        >

                          <div className="flex items-center gap-2">

                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-zinc-400">
                              ×
                            </span>

                            <span className="text-sm font-medium text-zinc-300">
                              {item.skill}
                            </span>

                          </div>


                          <p className="mt-2 pl-7 text-xs leading-5 text-zinc-500">
                            {item.evidence}
                          </p>

                        </div>

                      )
                    )

                  ) : jobMatch.missingSkills?.length > 0 ? (

                    <div className="flex flex-wrap gap-2">

                      {jobMatch.missingSkills.map(
                        (skill, index) => (

                          <span
                            key={index}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-400"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-sm text-zinc-600">
                      No missing skills detected.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* =================================================
                TECHNICAL + SOFT GAPS
            ================================================= */}

            <div className="grid gap-6 md:grid-cols-2">


              {/* TECHNICAL */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <h3 className="font-semibold">
                  Technical Gaps
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Technical requirements not explicitly found
                </p>


                <div className="mt-5 flex flex-wrap gap-2">

                  {jobMatch.missingTechnicalSkills?.length > 0 ? (

                    jobMatch.missingTechnicalSkills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-400"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-sm text-zinc-600">
                      No major technical gaps detected.
                    </p>

                  )}

                </div>

              </div>


              {/* SOFT */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <h3 className="font-semibold">
                  Soft Skill Gaps
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Soft skills not clearly demonstrated
                </p>


                <div className="mt-5 flex flex-wrap gap-2">

                  {jobMatch.missingSoftSkills?.length > 0 ? (

                    jobMatch.missingSoftSkills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-400"
                        >
                          {skill}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-sm text-zinc-600">
                      No major soft-skill gaps detected.
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* =================================================
                PREFERRED SKILLS
            ================================================= */}

            {jobMatch.preferredSkills?.length > 0 && (

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div>

                  <h3 className="font-semibold">
                    Preferred Skills
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Additional skills requested by the employer
                  </p>

                </div>


                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {jobMatch.preferredSkills.map(
                    (skill, index) => {

                      const isMatched =
                        jobMatch
                          .matchedPreferredSkills
                          ?.includes(skill);

                      return (

                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                        >

                          <span className="text-sm text-zinc-300">
                            {skill}
                          </span>

                          <span className="text-xs text-zinc-500">
                            {isMatched
                              ? "Matched"
                              : "Missing"}
                          </span>

                        </div>

                      );
                    }
                  )}

                </div>

              </div>

            )}


            {/* =================================================
                KEYWORD GAPS
            ================================================= */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h3 className="font-semibold">
                Keyword Gaps
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Important job-description concepts
                that are not clearly represented
                in your resume.
              </p>


              <div className="mt-5 flex flex-wrap gap-2">

                {jobMatch.keywordGaps?.length > 0 ? (

                  jobMatch.keywordGaps.map(
                    (keyword, index) => (

                      <span
                        key={index}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-400"
                      >
                        {keyword}
                      </span>

                    )
                  )

                ) : (

                  <p className="text-sm text-zinc-600">
                    No significant keyword gaps detected.
                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                RECOMMENDATIONS
            ================================================= */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
                  <Lightbulb size={17} />
                </div>

                <div>

                  <h3 className="font-semibold">
                    Recommendations
                  </h3>

                  <p className="text-xs text-zinc-500">
                    Practical ways to improve your match
                  </p>

                </div>

              </div>


              <div className="mt-5 space-y-4">

                {jobMatch.recommendations?.length > 0 ? (

                  jobMatch.recommendations.map(
                    (recommendation, index) => (

                      <div
                        key={index}
                        className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
                      >

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-xs font-medium">
                          {index + 1}
                        </div>

                        <p className="text-sm leading-6 text-zinc-400">
                          {recommendation}
                        </p>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-sm text-zinc-600">
                    No recommendations available.
                  </p>

                )}

              </div>

            </div>


          </section>

        )}


        {/* =================================================
            AI RESUME IMPROVEMENT
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              <Sparkles size={18} />
            </div>

            <div>

              <h2 className="font-semibold">
                AI Resume Improvement
              </h2>

              <p className="text-xs text-zinc-500">
                Rewrite resume content to make it
                clearer and more ATS-friendly.
              </p>

            </div>

          </div>


          <div className="mt-6">

            <label className="text-sm font-medium">
              Resume Content
            </label>

            <textarea
              value={improveText}
              onChange={(e) =>
                setImproveText(e.target.value)
              }
              placeholder="Paste a resume bullet, project description, or experience section..."
              className="mt-3 min-h-36 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
            />

          </div>


          {improveError && (
            <p className="mt-3 text-sm text-red-400">
              {improveError}
            </p>
          )}


          <button
            onClick={handleImproveResume}
            disabled={improving}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Sparkles size={17} />

            {improving
              ? "Improving Resume..."
              : "Improve With AI"}

          </button>

        </section>

        {/* ==================================================
    SAVE APPLICATION MODAL
================================================== */}

        {showSaveModal && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowSaveModal(false)}
          >

            <div
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* HEADER */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                    <Briefcase size={18} />
                  </div>

                  <div>

                    <h2 className="font-semibold">
                      Add to Applications
                    </h2>

                    <p className="text-xs text-zinc-500">
                      Save this job to your application tracker.
                    </p>

                  </div>

                </div>


                <button
                  onClick={() => setShowSaveModal(false)}
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>

              </div>


              {/* FORM */}

              <form
                onSubmit={handleSaveApplication}
                className="mt-6 space-y-4"
              >

                {/* COMPANY */}

                <div>

                  <label className="text-sm font-medium">
                    Company *
                  </label>

                  <input
                    type="text"
                    value={applicationForm.company}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        company: e.target.value,
                      })
                    }
                    placeholder="e.g. TCS"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />

                </div>


                {/* ROLE */}

                <div>

                  <label className="text-sm font-medium">
                    Role *
                  </label>

                  <input
                    type="text"
                    value={applicationForm.role}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        role: e.target.value,
                      })
                    }
                    placeholder="e.g. Software Developer"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />

                </div>


                {/* LOCATION */}

                <div>

                  <label className="text-sm font-medium">
                    Location
                  </label>

                  <input
                    type="text"
                    value={applicationForm.location}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g. Bangalore / Remote"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />

                </div>


                {/* SALARY */}

                <div>

                  <label className="text-sm font-medium">
                    Salary
                  </label>

                  <input
                    type="text"
                    value={applicationForm.salary}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        salary: e.target.value,
                      })
                    }
                    placeholder="e.g. 6-8 LPA"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />

                </div>


                {/* JOB URL */}

                <div>

                  <label className="text-sm font-medium">
                    Job URL
                  </label>

                  <input
                    type="url"
                    value={applicationForm.jobUrl}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        jobUrl: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />

                </div>


                {/* NOTES */}

                <div>

                  <label className="text-sm font-medium">
                    Notes
                  </label>

                  <textarea
                    value={applicationForm.notes}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Optional notes..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30"
                  />

                </div>


                {/* ERROR */}

                {saveApplicationError && (

                  <p className="text-sm text-red-400">
                    {saveApplicationError}
                  </p>

                )}


                {/* SUCCESS */}

                {saveApplicationSuccess && (

                  <p className="text-sm text-green-400">
                    {saveApplicationSuccess}
                  </p>

                )}


                {/* ACTIONS */}

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    disabled={savingApplication}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <Briefcase size={17} />

                    {savingApplication
                      ? "Saving..."
                      : "Save Application"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


        {/* =================================================
            AI IMPROVEMENT RESULT
        ================================================= */}

        {improvement && (

          <section className="mt-6 space-y-6">


            {/* ORIGINAL + IMPROVED */}

            <div className="grid gap-6 md:grid-cols-2">


              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <h3 className="font-semibold">
                  Original
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  {improvement.original}
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <h3 className="font-semibold">
                  AI Improved
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  {improvement.improved}
                </p>

              </div>

            </div>


            {/* CHANGES */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center gap-3">

                <Lightbulb size={20} />

                <h3 className="font-semibold">
                  What Changed
                </h3>

              </div>


              <div className="mt-5 space-y-4">

                {improvement.changes?.length > 0 ? (

                  improvement.changes.map(
                    (change, index) => (

                      <div
                        key={index}
                        className="flex gap-4"
                      >

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-medium">
                          {index + 1}
                        </div>

                        <p className="text-sm leading-6 text-zinc-400">
                          {change}
                        </p>

                      </div>

                    )
                  )

                ) : (

                  <p className="text-sm text-zinc-600">
                    No detailed changes available.
                  </p>

                )}

              </div>

            </div>


          </section>

        )}


        {/* =================================================
            FEATURE CARDS
        ================================================= */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <Feature
            title="ATS Compatibility"
            text="Analyze how well your resume is structured for ATS systems."
          />

          <Feature
            title="Skills Analysis"
            text="Identify technical skills and potential skill gaps."
          />

          <Feature
            title="AI Suggestions"
            text="Get actionable recommendations to improve your resume."
          />

        </section>


      </main>

    </div>
  );
}


// ======================================================
// FEATURE CARD
// ======================================================

function Feature({
  title,
  text,
}) {
  return (

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <CheckCircle2
        size={18}
        className="text-zinc-400"
      />

      <h3 className="mt-4 text-sm font-medium">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-zinc-600">
        {text}
      </p>

    </div>

  );
}


export default Resume;
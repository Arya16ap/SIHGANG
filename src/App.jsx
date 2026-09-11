import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  FileUp,
  FileCheck2,
  Loader2,
  Sparkles,
  CircleCheck,
  AlertTriangle,
  Lightbulb,
  Search,
  ArrowRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

function stageLabel(progress) {
  if (progress < 40) return "OCR / text extraction"
  if (progress < 70) return "Entity extraction"
  if (progress < 100) return "Matching to work orders"
  return "Scoring against plan"
}

function App() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle")
  const [progress, setProgress] = useState(0)

  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()

    const droppedFile = e.dataTransfer.files?.[0]

    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleProcess = () => {
    if (!file) return

    setStatus("processing")
    setProgress(0)

    let currentProgress = 0

    const interval = setInterval(() => {
      currentProgress += 20
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)

        setTimeout(() => {
          setStatus("complete")
        }, 500)
      }
    }, 250)
  }

  const handleReset = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const isComplete = status === "complete"

  return (
    <main className="min-h-screen bg-background px-6 py-12">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="mb-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <img
              src="/logo.png"
              alt="Dino logo"
              className="h-14 w-14 dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt=""
              aria-hidden="true"
              className="hidden h-14 w-14 dark:block"
            />
            <h1 className="text-5xl font-bold tracking-tight">
              Dino
            </h1>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Shop-floor reports, matched to the right work order.
          </p>
        </header>


        {/* ===================================================== */}
        {/* MAIN CONTENT */}
        {/* ===================================================== */}

        <div
          className={`
            flex items-center justify-center gap-6
            transition-all duration-500
            ${isComplete ? "flex-row" : "flex-col"}
          `}
        >

          {/* ================================================= */}
          {/* UPLOAD / REPORT CARD */}
          {/* ================================================= */}

          <motion.div
            layout
            initial={false}
            animate={{
              width: isComplete ? "50%" : "520px",
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >

            <Card className="h-[560px] overflow-hidden rounded-2xl shadow-sm">

              <AnimatePresence mode="wait">


                {/* ========================= */}
                {/* UPLOAD */}
                {/* ========================= */}

                {status === "idle" && (
                  <motion.div
                    key="upload"
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="h-full"
                  >

                    <CardHeader className="text-center">

                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted/50">
                        <FileUp className="h-6 w-6" />
                      </div>

                      <CardTitle>
                        Upload a production report
                      </CardTitle>

                      <CardDescription>
                        Drop a shift or operator report — Dino extracts the
                        details and matches it to the right work order.
                      </CardDescription>

                    </CardHeader>


                    <CardContent className="flex h-[420px] flex-col items-center justify-center">

                      {/* DROP ZONE */}

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition hover:bg-muted/40"
                      >

                        <FileUp className="mb-4 h-8 w-8 text-muted-foreground" />

                        {file ? (
                          <>
                            <p className="font-medium">
                              {file.name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">
                              Drop your report here
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                              or click to browse
                            </p>

                            <p className="mt-4 text-xs text-muted-foreground">
                              Handwritten notes, scans or exports — PDF, PNG, JPG
                            </p>
                          </>
                        )}

                        <input
                          ref={inputRef}
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                      </div>


                      <Button
                        onClick={handleProcess}
                        disabled={!file}
                        className="mt-6"
                      >
                        Extract &amp; Match

                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                    </CardContent>

                  </motion.div>
                )}


                {/* ========================= */}
                {/* PROCESSING */}
                {/* ========================= */}

                {status === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{
                      opacity: 0,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="h-full"
                  >

                    <CardContent className="flex h-full flex-col items-center justify-center text-center">

                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border bg-muted/50">

                        <Loader2 className="h-7 w-7 animate-spin" />

                      </div>


                      <h2 className="text-xl font-semibold">
                        Matching report to plan...
                      </h2>


                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Reading the report, pulling out quantities and part
                        numbers, then matching them against open work orders.
                      </p>


                      <div className="mt-8 w-full max-w-sm">

                        <Progress value={progress} />

                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">

                          <span>
                            {stageLabel(progress)}
                          </span>

                          <span>
                            {progress}%
                          </span>

                        </div>

                      </div>

                    </CardContent>

                  </motion.div>
                )}


                {/* ========================= */}
                {/* COMPLETED REPORT */}
                {/* ========================= */}

                {status === "complete" && (
                  <motion.div
                    key="report"
                    initial={{
                      opacity: 0,
                      x: -40,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.15,
                    }}
                    className="h-full"
                  >

                    <CardHeader>

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">

                            <FileCheck2 className="h-5 w-5" />

                          </div>

                          <div>

                            <CardTitle>
                              Structured Report
                            </CardTitle>

                            <CardDescription>
                              {file?.name}
                            </CardDescription>

                          </div>

                        </div>


                        <Badge variant="secondary">

                          <CircleCheck className="mr-1 h-3 w-3" />

                          Matched · 94%

                        </Badge>

                      </div>

                    </CardHeader>


                    <Separator />


                    <ScrollArea className="h-[420px]">

                      <CardContent className="space-y-6 pt-6">

                        <ReportSection
                          title="Report Details"
                          items={[
                            ["Report Type", "Shift Production Report"],
                            ["Date", "10 September 2026"],
                            ["Shift", "B (14:00 – 22:00)"],
                            ["Reference ID", "SPR-2026-1048"],
                          ]}
                        />

                        <ReportSection
                          title="Matched Work Order"
                          items={[
                            ["Work Order", "WO-4417"],
                            ["Part Number", "AX-2210-R"],
                            ["Line", "Assembly Line 3"],
                            ["Operator", "Emp-2291"],
                          ]}
                        />

                        <ReportSection
                          title="Output vs Plan"
                          items={[
                            ["Planned Qty", "1,200 units"],
                            ["Reported Qty", "1,046 units"],
                            ["Rejected", "38 units"],
                            ["Downtime", "42 min"],
                          ]}
                        />

                        <ReportSection
                          title="Operator Notes"
                          content="Free-text notes from the report have been parsed into structured fields. Quantities, part numbers and downtime references were normalized before matching."
                        />

                        <ReportSection
                          title="Deviations"
                          content="Reported output falls short of the planned quantity for this shift, and recorded downtime exceeds the allowance set in the production plan."
                        />

                      </CardContent>

                    </ScrollArea>


                    <div className="border-t px-6 py-3">

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                      >
                        Process another report
                      </Button>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </Card>

          </motion.div>


          {/* ================================================= */}
          {/* AI CARD */}
          {/* ================================================= */}

          <AnimatePresence>

            {isComplete && (

              <motion.div
                initial={{
                  opacity: 0,
                  x: 80,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full md:w-1/2"
              >

                <Card className="h-[560px] overflow-hidden rounded-2xl shadow-sm">

                  <CardHeader>

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">

                        <Sparkles className="h-5 w-5" />

                      </div>


                      <div>

                        <CardTitle>
                          Match &amp; Risk Analysis
                        </CardTitle>

                        <CardDescription>
                          How this report scores against the production plan
                        </CardDescription>

                      </div>

                    </div>

                  </CardHeader>


                  <Separator />


                  <ScrollArea className="h-[475px]">

                    <CardContent className="space-y-4 pt-6">


                      {/* WARNING */}

                      <Alert>

                        <AlertTriangle className="h-4 w-4" />

                        <AlertTitle>
                          Output shortfall
                        </AlertTitle>

                        <AlertDescription>
                          Reported quantity is 154 units below plan for
                          WO-4417. Confirm against the line counter before
                          closing the shift.
                        </AlertDescription>

                      </Alert>


                      {/* RECOMMENDATION */}

                      <SuggestionCard
                        icon={<Lightbulb className="h-4 w-4" />}
                        title="Recommended action"
                        description="Reschedule the remaining 154 units into the next shift on Line 3, or flag WO-4417 for partial completion."
                      />


                      {/* KEY FINDING */}

                      <SuggestionCard
                        icon={<Search className="h-4 w-4" />}
                        title="Downtime driver"
                        description="Operator notes reference a tooling changeover as the cause of the 42 minute stoppage — the largest deviation in this report."
                      />


                      {/* POSITIVE */}

                      <SuggestionCard
                        icon={<CircleCheck className="h-4 w-4" />}
                        title="High match confidence"
                        description="Part number and line reference both resolve cleanly to WO-4417, giving a 94% match against the active production plan."
                      />

                    </CardContent>

                  </ScrollArea>

                </Card>

              </motion.div>

            )}

          </AnimatePresence>

        </div>


        {/* FOOTER */}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Matches and risk flags are AI-generated — verify against the original report before acting on them.
        </p>

      </div>

    </main>
  )
}


/* ============================================================= */
/* REPORT SECTION */
/* ============================================================= */

function ReportSection({ title, items, content }) {
  return (
    <section>

      <h3 className="mb-3 text-sm font-semibold">
        {title}
      </h3>


      {items ? (

        <div className="space-y-2 rounded-xl border p-4">

          {items.map(([label, value]) => (

            <div
              key={label}
              className="flex justify-between gap-4 text-sm"
            >

              <span className="text-muted-foreground">
                {label}
              </span>

              <span className="text-right font-medium">
                {value}
              </span>

            </div>

          ))}

        </div>

      ) : (

        <p className="rounded-xl border p-4 text-sm leading-6 text-muted-foreground">
          {content}
        </p>

      )}

    </section>
  )
}


/* ============================================================= */
/* AI SUGGESTION */
/* ============================================================= */

function SuggestionCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border p-4 transition hover:bg-muted/30">

      <div className="flex gap-3">

        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">

          {icon}

        </div>


        <div>

          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

        </div>

      </div>

    </div>
  )
}


export default App
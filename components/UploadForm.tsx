"use client"

import { useRef, type DragEvent, type KeyboardEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileImage, Upload, X } from "lucide-react"
import { useForm, type ControllerRenderProps } from "react-hook-form"
import { z } from "zod"

import LoadingOverlay from "@/components/LoadingOverlay"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"

const MAX_PDF_SIZE = 50 * 1024 * 1024
const MAX_COVER_SIZE = 10 * 1024 * 1024

const isBrowserFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File

const uploadFormSchema = z.object({
  pdf: z
    .custom<File | undefined>(isBrowserFile, "Please choose a PDF file")
    .refine((file) => !file || file.type === "application/pdf", "Only PDF files are supported")
    .refine((file) => !file || file.size <= MAX_PDF_SIZE, "PDF must be 50MB or smaller"),
  cover: z
    .custom<File | undefined>((file) => file === undefined || isBrowserFile(file), "Please choose an image")
    .refine((file) => !file || file.type.startsWith("image/"), "Cover must be an image")
    .refine((file) => !file || file.size <= MAX_COVER_SIZE, "Cover image must be 10MB or smaller")
    .optional(),
  title: z.string().trim().min(1, "Enter the book title"),
  author: z.string().trim().min(1, "Enter the author name"),
  voice: z.enum(["dave", "daniel", "chris", "rachel", "sarah"], {
    error: "Choose an assistant voice",
  }),
})

type UploadFormValues = z.infer<typeof uploadFormSchema>
type FileField = ControllerRenderProps<UploadFormValues, "pdf" | "cover">

const voices = {
  "Male Voices": [
    { id: "dave", name: "Dave", description: "Warm and conversational" },
    { id: "daniel", name: "Daniel", description: "Calm and thoughtful" },
    { id: "chris", name: "Chris", description: "Clear and energetic" },
  ],
  "Female Voices": [
    { id: "rachel", name: "Rachel", description: "Rich and expressive" },
    { id: "sarah", name: "Sarah", description: "Gentle and engaging" },
  ],
} as const

type FileDropzoneProps = {
  field: FileField
  accept: string
  idleText: string
  hint: string
  icon: "upload" | "image"
}

function FileDropzone({ field, accept, idleText, hint, icon }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const file = field.value
  const Icon = icon === "upload" ? Upload : FileImage

  const selectFile = (selected?: File) => {
    field.onChange(selected)
    field.onBlur()
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    selectFile(event.dataTransfer.files[0])
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      className={cn("upload-dropzone", file && "upload-dropzone-uploaded")}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        onBlur={field.onBlur}
        onChange={(event) => {
          selectFile(event.target.files?.[0])
          event.target.value = ""
        }}
      />
      <Icon className="upload-dropzone-icon" strokeWidth={1.6} aria-hidden="true" />
      {file ? (
        <div className="flex max-w-[90%] items-center gap-1.5">
          <span className="upload-dropzone-text truncate">{file.name}</span>
          <button
            className="upload-dropzone-remove shrink-0"
            type="button"
            aria-label={`Remove ${file.name}`}
            onClick={(event) => {
              event.stopPropagation()
              selectFile(undefined)
            }}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <p className="upload-dropzone-text">{idleText}</p>
      )}
      <p className="upload-dropzone-hint">
        {file ? "Click to change file" : hint}
      </p>
    </div>
  )
}

const UploadForm = () => {
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      pdf: undefined,
      cover: undefined,
      title: "",
      author: "",
      voice: undefined,
    },
  })

  const onSubmit = async () => {
    // This preserves the loading treatment until the upload endpoint is connected.
    await new Promise((resolve) => window.setTimeout(resolve, 1200))
  }

  return (
    <>
      {form.formState.isSubmitting && <LoadingOverlay />}

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FormField
            control={form.control}
            name="pdf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">PDF file</FormLabel>
                <FileDropzone
                  field={field}
                  accept="application/pdf,.pdf"
                  idleText="Click to upload PDF"
                  hint="PDF file (max 50MB)"
                  icon="upload"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Cover image</FormLabel>
                <FileDropzone
                  field={field}
                  accept="image/*"
                  idleText="Click to upload cover image"
                  hint="Leave empty to auto-generate from PDF"
                  icon="image"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <input
                    className="form-input"
                    placeholder="ex: Rich Dad Poor Dad"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <input
                    className="form-input"
                    placeholder="ex: Robert Kiyosaki"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                <div className="space-y-5">
                  {Object.entries(voices).map(([group, groupVoices]) => (
                    <fieldset key={group} className="space-y-3">
                      <legend className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                        {group}
                      </legend>
                      <div className="voice-selector-options">
                        {groupVoices.map((voice) => {
                          const selected = field.value === voice.id

                          return (
                            <label
                              key={voice.id}
                              htmlFor={`voice-${voice.id}`}
                              className={cn(
                                "voice-selector-option",
                                selected
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default"
                              )}
                            >
                              <input
                                id={`voice-${voice.id}`}
                                className="sr-only"
                                type="radio"
                                name={field.name}
                                value={voice.id}
                                checked={selected}
                                onBlur={field.onBlur}
                                onChange={() => field.onChange(voice.id)}
                              />
                              <span
                                className={cn(
                                  "size-4 shrink-0 rounded-full border",
                                  selected
                                    ? "border-[#663820] bg-[#663820] ring-2 ring-white ring-offset-1 ring-offset-[#663820]"
                                    : "border-[#8b7355] bg-white"
                                )}
                                aria-hidden="true"
                              />
                              <span className="min-w-0">
                                <span className="block font-serif text-base font-semibold text-black">
                                  {voice.name}
                                </span>
                                <span className="block text-sm text-[var(--text-secondary)]">
                                  {voice.description}
                                </span>
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="form-btn"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Begin Synthesis
          </Button>
        </form>
      </Form>
    </>
  )
}

export default UploadForm

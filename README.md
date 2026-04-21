# The Cheese Grater Editor

A custom-built CMS and publishing interface for The Cheese Grater Magazine, designed to allow editors to create, edit, preview, and publish articles through a structured workflow.

Editor: https://editor.cheesegratermagazine.org  
(Note: authentication is required to access the interface)

---

## Features

- Secure authentication using Supabase Auth
- Article creation, editing, and updating workflows
- Rich text editing with preview functionality
- Draft persistence and editing support
- Image upload pipeline integrated with Cloudflare R2
- Publishing system connected to the live website
- Metadata management (titles, summaries, images, etc.)

---

## Tech Stack

- React + TypeScript
- Supabase (Auth + Database)
- PostgreSQL
- Cloudflare R2 (Image storage)
- Vercel (Hosting & Deployment)

---

## My Role

I built this editor platform from scratch as the internal publishing system for the new Cheese Grater website.

The goal was to replace informal or legacy workflows with a structured, scalable CMS tailored to the publication’s needs.

---

## How It Works

- Editors authenticate via Supabase
- Articles are created and edited through the React interface
- Images are uploaded to Cloudflare R2 and stored with article data
- Content is saved to Supabase
- Publishing triggers updates to the live site

---

## Deployment

The editor is deployed separately from the public website and connects to shared backend services (Supabase and Cloudflare R2).

---

## Status

Actively used by editors and under continuous development.

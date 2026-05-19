import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { MainLayout } from '#/components/layout/MainLayout'
import { ScrollArea } from '#/components/ui/scroll-area'
import {
  Github,
  Server,
  Database,
  Shield,
  Globe,
  HardDrive,
  Cpu,
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <MainLayout>
      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            System Architecture & Design
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed font-sans">
            Under-the-hood configuration and stack layout for this expense
            tracking application.
          </p>
        </div>

        <a
          href="https://github.com/najazul/expense-tracker"
          target="_blank"
          rel="noreferrer"
          className="self-start md:self-center"
        >
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 text-sm transition-colors duration-200">
            <Github className="w-4 h-4" />
            View Repository
          </Button>
        </a>
      </div>

      {/* Scrollable Workspace Container */}
      <ScrollArea className="relative z-10 flex-1 min-h-0 pr-4">
        <div className="space-y-8 pr-2 pb-4">
          {/* Core Stack Section */}
          <div>
            <h2 className="text-xl font-semibold text-white font-sans tracking-tight mb-4">
              The Engine Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border text-card-foreground rounded-lg transition-colors duration-200">
                <CardHeader className="flex flex-row items-center gap-3 pb-3 space-y-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-white font-sans">
                    React SPA Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Vite & TypeScript SPA. Uses TanStack Router for type-safe
                  routing and layout navigation.
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-card-foreground rounded-lg transition-colors duration-200">
                <CardHeader className="flex flex-row items-center gap-3 pb-3 space-y-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <Server className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-white font-sans">
                    C# Controller API
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Built with ASP.NET Core 10.0 Web API using Controller
                  architecture. Manages schema, entities, and validation.
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-card-foreground rounded-lg transition-colors duration-200">
                <CardHeader className="flex flex-row items-center gap-3 pb-3 space-y-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <Database className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-white font-sans">
                    PostgreSQL
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Managed relational database. Stores core expense records, user
                  accounts, and index lookups.
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Infrastructure & Services Section */}
          <div>
            <h2 className="text-xl font-semibold text-white font-sans tracking-tight mb-4">
              Cloud Infrastructure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border text-card-foreground rounded-lg transition-colors duration-200">
                <CardHeader className="flex flex-row items-center gap-3 pb-3 space-y-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-white font-sans">
                    Cloudflare R2 Storage
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Archiving of uploaded physical receipt photos using
                  S3-compatible endpoints mapped to my custom domain.
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-card-foreground rounded-lg transition-colors duration-200">
                <CardHeader className="flex flex-row items-center gap-3 pb-3 space-y-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <Shield className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-white font-sans">
                    Google OAuth & JWT
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Client-side Google Identity login. Backend verifies payloads
                  to issue custom signed JWT access tokens.
                </CardContent>
              </Card>

              <Card className="bg-card border-border text-card-foreground rounded-lg transition-colors duration-200">
                <CardHeader className="flex flex-row items-center gap-3 pb-3 space-y-0">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                    <Globe className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight text-white font-sans">
                    Cloudflare DNS
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed font-sans">
                  Accelerates requests. Securely routes production traffic to my
                  personal domain instead of hosting defaults.
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Docker & Deployment Section */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <h3 className="text-lg font-semibold text-white font-sans tracking-tight">
              Containerization & Deployment
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed font-sans">
              Both services run inside Docker containers deployed on Render,
              aligning local and production setups.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              <div className="space-y-2 bg-[#1c1c1c]/40 p-4 rounded-md border border-border">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider font-sans">
                  1. Dual Render Service Pods
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  • <strong>C# API Pod:</strong> Containerized .NET 10 process
                  serving requests. Linked to my managed database.
                  <br />• <strong>Client SPA Pod:</strong> Node container
                  building Vite assets. Serves static files on port 3000.
                  <br />• <strong>Active Warmup:</strong> Custom cron job pings
                  both web pods to bypass Render's free tier sleep cycle.
                </p>
              </div>

              <div className="space-y-2 bg-[#1c1c1c]/40 p-4 rounded-md border border-border">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider font-sans">
                  2. Seamless System Linking
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  • <strong>Build-Arg Injection:</strong> Bakes VITE_API_BASE
                  directly into my client bundle during compilation.
                  <br />• <strong>CORS Whitelist:</strong> API permits standard
                  client origin to execute preflights.
                  <br />• <strong>Vite Hosting:</strong> Configured{' '}
                  {'preview: { allowedHosts: true }'} to allow public proxy
                  hosts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  )
}

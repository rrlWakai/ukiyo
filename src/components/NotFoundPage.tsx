type NotFoundPageProps = {
  title?: string
  description?: string
}

export function NotFoundPage({
  title = 'Page Not Found',
  description = 'The page you are looking for does not exist or may have been moved.',
}: NotFoundPageProps) {
  return (
    <main className="min-h-[70vh] px-6 pt-32 pb-24 lg:px-8">
      <div className="mx-auto max-w-3xl border border-border bg-card p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">404</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">{title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{description}</p>
      </div>
    </main>
  )
}

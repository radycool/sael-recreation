type SectionProps = {
  eyebrow: string
  title: string
  body: string
}

export default function Section({ eyebrow, title, body }: SectionProps) {
  return (
    <section className="section">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  )
}

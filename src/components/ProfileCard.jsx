/**
 * Reusable card that shows a titled list of label/value rows.
 * Used by both the Dashboard summary and the Profile page.
 */
export default function ProfileCard({ title, description, rows, footer }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>{title}</h2>
        {description ? <p className="muted">{description}</p> : null}
      </div>

      {rows && rows.length > 0 ? (
        <dl className="detail-list">
          {rows.map((row) => (
            <div className="detail-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {footer ? <div className="card-footer">{footer}</div> : null}
    </section>
  );
}

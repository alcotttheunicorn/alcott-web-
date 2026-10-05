const metrics = [
  { value: '18,000+', label: 'Shipments delivered' },
  { value: '220+', label: 'Global destinations' },
  { value: '98%', label: 'On-time delivery rate' },
  { value: '5★', label: 'Average customer rating' },
]

export function PerformanceMetricsSection() {
  return (
    <section
      aria-labelledby="performance-metrics-heading"
      className="w-full bg-white py-16 lg:py-20
    ">
      <div className="max-w-9xl mx-auto px-4 lg:px-12 flex flex-col items-center gap-12">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="text-[#4043ff] text-[11px] font-bold tracking-[0.88px] font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
            TRUSTED BY
          </div>
          <h2
            id="performance-metrics-heading"
            className="text-[#0d1124] text-[22px] sm:text-[26px] lg:text-3xl font-bold tracking-[-0.6px] font-[Plus_Jakarta_Sans',system-ui,sans-serif]"
          >
            Businesses across Africa and beyond.
          </h2>
        </header>

        <dl className="w-full grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-y-10 lg:gap-y-0">
          {metrics.map((metric, index) => (
            <MetricItem
              key={metric.label}
              metric={metric}
              showDivider={index < metrics.length - 1}
            />
          ))}
        </dl>
      </div>
    </section>
  )
}

function MetricItem({
  metric,
  showDivider,
}: {
  metric: { value: string; label: string }
  showDivider: boolean
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <dt className="sr-only">{metric.label}</dt>
        <dd className="text-[#4043ff] text-[32px] sm:text-[40px] font-bold tracking-[-0.72px] font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
          {metric.value}
        </dd>
        <div className="text-[#5b6070] text-[12px] sm:text-[13px] text-center font-[Plus_Jakarta_Sans',system-ui,sans-serif]">
          {metric.label}
        </div>
      </div>
      {showDivider && (
        <div
          aria-hidden="true"
          className="hidden lg:block w-px h-14 bg-[#e8ecf4]"
        />
      )}
    </>
  )
}
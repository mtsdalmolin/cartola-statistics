export function enhanceImageStylePropsToGenerateStaticImage(_: Document, element: HTMLElement) {
  element.style.padding = '15px 25px'
  element.querySelectorAll<HTMLElement>('.progress-label').forEach(($el) => {
    $el.style.paddingBottom = '5px'
  })
  element.querySelectorAll<HTMLElement>('.progress-data').forEach(($el) => {
    const progressLabels = $el.querySelectorAll(
      '.mantine-Progress-label'
    ) as unknown as HTMLElement[]
    progressLabels.forEach(($pLabel) => {
      $pLabel.style.paddingBottom = '13px'
    })
  })
}

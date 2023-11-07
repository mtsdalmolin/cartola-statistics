import { Progress } from '@mantine/core'

const FINISH_TYPE_TITLE = {
  blockedFinishes: 'Fin. defendidas',
  finishesOnPost: 'Fin. na trave',
  goals: 'Gols',
  outOfTargetFinishes: 'Fin. para fora'
}

export function FinishStats({
  finishes
}: {
  finishes: {
    blockedFinishes: number
    finishesOnPost: number
    goals: number
    outOfTargetFinishes: number
  }
}) {
  const { blockedFinishes, finishesOnPost, goals, outOfTargetFinishes } = finishes
  const totalFinishes = blockedFinishes + finishesOnPost + goals + outOfTargetFinishes

  return (
    <div className="grow-[3] w-fit">
      {Object.entries(finishes).map(([finishType, finishes]) => (
        <div key={finishType}>
          <div className="progress-label flex justify-between w-full text-xs text-left">
            <span>{FINISH_TYPE_TITLE[finishType as keyof typeof FINISH_TYPE_TITLE]}</span>
            <span>{((finishes * 100) / totalFinishes).toFixed(1)}%</span>
          </div>
          <Progress
            className="progress-data"
            radius="xs"
            size="xl"
            sections={[
              {
                value: (finishes * 100) / totalFinishes,
                color: '#104936',
                label: finishes.toString()
              }
            ]}
          />
        </div>
      ))}
    </div>
  )
}

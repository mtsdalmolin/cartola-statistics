'use client'

import { experimental_useFormState as useFormState } from 'react-dom'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import brand from '@/public/logo/brand.svg'
import { Text } from '@mantine/core'

import { isEmpty } from 'lodash'

import { getTeamStatistics } from './actions'
import { SearchTeamStatisticsForm } from './common/components/forms/search-team-statistics'
import { Artillery } from './common/components/statistics/artillery'
// import { BestAwayPlayer } from './common/components/statistics/best-away-player'
import { BestBench } from './common/components/statistics/best-bench'
import { BestCoach } from './common/components/statistics/best-coach'
// import { BestHomePlayer } from './common/components/statistics/best-home-player'
// import { DefenseEfficiency } from './common/components/statistics/defense-efficiency'
// import { FinishEfficiency } from './common/components/statistics/finish-efficiency'
import { HighestAverage } from './common/components/statistics/highest-average'
import { HighestFinisher } from './common/components/statistics/highest-finisher'
import { HighestScorer } from './common/components/statistics/highest-scorer'
import { LeastValuedPlayer } from './common/components/statistics/least-valued-player'
import { LineupsPerClub } from './common/components/statistics/lineups-per-club'
import { MoreAssists } from './common/components/statistics/more-assists'
import { MoreDefenses } from './common/components/statistics/more-defenses'
import { MoreRedCards } from './common/components/statistics/more-red-cards'
import { MoreTackles } from './common/components/statistics/more-tackles'
import { MoreYellowCards } from './common/components/statistics/more-yellow-cards'
import { MostOffsidedPlayer } from './common/components/statistics/most-offsided-player'
import { MostRoundsAsCaptain } from './common/components/statistics/most-rounds-as-captain'
import { MostScheduledPlayer } from './common/components/statistics/most-scheduled-player'
import { MostValuedPlayer } from './common/components/statistics/most-valued-player'
import { PointsPerClub } from './common/components/statistics/points-per-club'
import { StatisticsSection } from './common/components/statistics/section'
import { WorstGoalkeeper } from './common/components/statistics/worst-goalkeeper'
import { TeamProfile } from './common/components/team/profile'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

export default function Home() {
  const { pending } = useFormStatus()
  const [state, formAction] = useFormState(getTeamStatistics, {
    message: null,
    data: null
  })

  return (
    <div className="w-full">
      <div className="relative flex h-[100vh]">
        <div className="m-auto w-fit">
          <Image src={brand} width={500} height={500} alt="brand" />
          <SearchTeamStatisticsForm action={formAction} />
          <Text
            className={`${bebasNeue.className} w-max text-center absolute bottom-[1rem] left-[50%] translate-x-[-50%]`}
            size="md"
          >
            feito com ⚽ por{' '}
            <Link href="https://github.com/mtsdalmolin" target="_blank">
              @mtsdalmolin
            </Link>
          </Text>
        </div>
      </div>
      {state.data ? (
        <div className="py-4">
          <TeamProfile
            matchesData={state.data.rounds}
            teamInfo={state.data.teamInfo}
            trophies={state.data.trophies}
            apiHasEndedRequestsAndReturnedData={!!state.data && !pending}
          />
          {!isEmpty(state.data.athleteStatistics) ? (
            <>
              <StatisticsSection title="os melhores">
                <MostValuedPlayer crewData={state.data.athleteStatistics} />
                <BestCoach
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <BestBench crewData={state.data.benchStatistics} matchesData={state.data.rounds} />
                <Artillery
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <HighestFinisher crewData={state.data.athleteStatistics} />
                {/* <BestHomePlayer crewData={state.data.athleteStatistics} />
            <BestAwayPlayer crewData={state.data.athleteStatistics} /> */}
                {/* <FinishEfficiency crewData={state.data.athleteStatistics} />
            <DefenseEfficiency crewData={state.data.athleteStatistics} /> */}
                <MoreAssists
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <MoreDefenses
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <MoreTackles
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <HighestAverage
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
              </StatisticsSection>
              <StatisticsSection title="os piores">
                <LeastValuedPlayer crewData={state.data.athleteStatistics} />
                <WorstGoalkeeper
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <MoreYellowCards
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <MoreRedCards
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
              </StatisticsSection>
              <StatisticsSection title="resto">
                <MostRoundsAsCaptain crewData={state.data.athleteStatistics} />
                <LineupsPerClub clubsData={state.data.clubStatistics} />
                <PointsPerClub clubsData={state.data.clubStatistics} />
                <HighestScorer
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <MostScheduledPlayer
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
                <MostOffsidedPlayer
                  crewData={state.data.athleteStatistics}
                  matchesData={state.data.rounds}
                />
              </StatisticsSection>
            </>
          ) : (
            'Sem dados'
          )}
        </div>
      ) : null}
    </div>
  )
}

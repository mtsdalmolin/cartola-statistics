'use client'
import { usePathname } from 'next/navigation'

import { GetTeamsStatisticsActionState } from '@/app/actions'
import { Artillery } from '@/app/common/components/statistics/artillery'
import { BestBench } from '@/app/common/components/statistics/best-bench'
import { BestCoach } from '@/app/common/components/statistics/best-coach'
import { HighestAverage } from '@/app/common/components/statistics/highest-average'
import { HighestFinisher } from '@/app/common/components/statistics/highest-finisher'
import { HighestScorer } from '@/app/common/components/statistics/highest-scorer'
import { LeastValuedPlayer } from '@/app/common/components/statistics/least-valued-player'
import { LineupsPerClub } from '@/app/common/components/statistics/lineups-per-club'
import { MoreAssists } from '@/app/common/components/statistics/more-assists'
import { MoreDefenses } from '@/app/common/components/statistics/more-defenses'
import { MoreRedCards } from '@/app/common/components/statistics/more-red-cards'
import { MoreTackles } from '@/app/common/components/statistics/more-tackles'
import { MoreYellowCards } from '@/app/common/components/statistics/more-yellow-cards'
import { MostOffsidedPlayer } from '@/app/common/components/statistics/most-offsided-player'
import { MostRoundsAsCaptain } from '@/app/common/components/statistics/most-rounds-as-captain'
import { MostScheduledPlayer } from '@/app/common/components/statistics/most-scheduled-player'
import { MostValuedPlayer } from '@/app/common/components/statistics/most-valued-player'
import { PointsPerClub } from '@/app/common/components/statistics/points-per-club'
import { StatisticsSection } from '@/app/common/components/statistics/section'
import { WorstGoalkeeper } from '@/app/common/components/statistics/worst-goalkeeper'
import { TeamProfile } from '@/app/common/components/team/profile'

import { isEmpty } from 'lodash'

import { Flex } from '../components/flex'
import { Lineup } from '../components/lineup'
import { FinishesOnPost } from '../components/statistics/finishes-on-post'
import { MoreFouls } from '../components/statistics/more-fouls'
import { ParticipationInGoals } from '../components/statistics/participation-in-goals'
import { ShareOnTwitterButtonLink } from '../components/team/trophies'
import { ExtractImageContextProvider } from '../contexts/extract-image-context.client'

export default function TeamStatisticsContent({
  data
}: {
  data: GetTeamsStatisticsActionState['data']
}) {
  const pathname = usePathname()

  return data ? (
    <ExtractImageContextProvider>
      <div className="py-4">
        <TeamProfile matchesData={data.rounds} teamInfo={data.teamInfo} trophies={data.trophies} />
        <Flex className="w-full py-4" justify="center">
          <ShareOnTwitterButtonLink type="trophyBoard" teamId={data.teamInfo.id.toString()} />
        </Flex>
        {!isEmpty(data.athleteStatistics) ? (
          <>
            <StatisticsSection title="os melhores">
              <HighestScorer crewData={data.athleteStatistics} matchesData={data.rounds} />
              <HighestAverage crewData={data.athleteStatistics} matchesData={data.rounds} />
              <MostValuedPlayer crewData={data.athleteStatistics} />
              <Artillery crewData={data.athleteStatistics} matchesData={data.rounds} />
              <HighestFinisher crewData={data.athleteStatistics} />
              <MoreAssists crewData={data.athleteStatistics} matchesData={data.rounds} />
              <ParticipationInGoals crewData={data.athleteStatistics} matchesData={data.rounds} />
              <MoreTackles crewData={data.athleteStatistics} matchesData={data.rounds} />
              <MoreDefenses crewData={data.athleteStatistics} matchesData={data.rounds} />
              <BestCoach crewData={data.athleteStatistics} matchesData={data.rounds} />
              <BestBench crewData={data.benchStatistics} matchesData={data.rounds} />
            </StatisticsSection>
            <Lineup lineup={data.lineups.bestTeam} matchesData={data.rounds} />
            <StatisticsSection title="os piores">
              <LeastValuedPlayer crewData={data.athleteStatistics} />
              <MoreYellowCards crewData={data.athleteStatistics} matchesData={data.rounds} />
              <MoreRedCards crewData={data.athleteStatistics} matchesData={data.rounds} />
              <WorstGoalkeeper crewData={data.athleteStatistics} matchesData={data.rounds} />
              <MostOffsidedPlayer crewData={data.athleteStatistics} matchesData={data.rounds} />
              <MoreFouls crewData={data.athleteStatistics} matchesData={data.rounds} />
            </StatisticsSection>
            <Lineup
              lineup={data.lineups.worstTeam}
              matchesData={data.rounds}
              worstCaptain
              invertSummary
            />
            <StatisticsSection title="resto">
              <MostRoundsAsCaptain crewData={data.athleteStatistics} />
              <LineupsPerClub clubsData={data.clubStatistics} />
              <PointsPerClub clubsData={data.clubStatistics} />
              <MostScheduledPlayer crewData={data.athleteStatistics} matchesData={data.rounds} />
              <FinishesOnPost crewData={data.athleteStatistics} matchesData={data.rounds} />
            </StatisticsSection>
          </>
        ) : (
          'Sem dados'
        )}
      </div>
    </ExtractImageContextProvider>
  ) : null
}

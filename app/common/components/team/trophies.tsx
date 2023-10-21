import Image from 'next/image'

import { type TrophiesReturnType } from '@/app/actions'
import bagreBadge from '@/public/badges/bagre-badge.svg'
import hattrickBadge from '@/public/badges/hat-trick-badge.svg'
import moreThanHundredFiftyPointsInRoundBadge from '@/public/badges/more-than-hundred-fifty-points-in-round-badge.svg'
import moreThanHundredPointsInRoundBadge from '@/public/badges/more-than-hundred-points-in-round-badge.svg'
import moreThanThirtyPointsWithOnePlayerBadge from '@/public/badges/more-than-thirty-points-with-one-player-badge.svg'
import sevenPlayersScoredInRoundBadge from '@/public/badges/seven-players-scored-in-round-badge.svg'
import threePlayersMissedPenaltyBadge from '@/public/badges/three-players-missed-penalty-badge.svg'
import threePlayersRedCardedBadge from '@/public/badges/three-players-red-carded-badge.svg'

export function Trophies({ trophies }: { trophies: TrophiesReturnType }) {
  return (
    <div className="flex">
      {trophies['player-scored-hattrick'] ? (
        <Image
          className="hover:scale-150"
          src={hattrickBadge}
          width={128}
          height={128}
          alt="Medalha de conquista quando um jogador escalado fez 3 gols na partida"
        />
      ) : null}
      {trophies['more-than-30-points-with-player-in-round'] ? (
        <Image
          className="hover:scale-150"
          src={moreThanThirtyPointsWithOnePlayerBadge}
          width={128}
          height={128}
          alt="Medalha de conquista quando pontuou mais de 30 com apenas um jogador"
        />
      ) : null}
      {trophies['more-than-100-points-in-round'] ? (
        <Image
          className="hover:scale-150"
          src={moreThanHundredPointsInRoundBadge}
          width={128}
          height={128}
          alt="Medalha de conquista quando atingiu 100 pontos ou mais em uma rodada"
        />
      ) : null}
      {trophies['more-than-150-points-in-round'] ? (
        <Image
          className="hover:scale-150"
          src={moreThanHundredFiftyPointsInRoundBadge}
          width={128}
          height={128}
          alt="Medalha de conquista quando atingiu 150 pontos ou mais em uma rodada"
        />
      ) : null}
      {trophies['seven-players-scored'] ? (
        <Image
          className="hover:scale-150"
          src={sevenPlayersScoredInRoundBadge}
          width={128}
          height={128}
          alt="Medalha de conquista quando em uma escalação, 7 jogadores marcaram gols"
        />
      ) : null}
      {trophies['three-players-missed-penalty'] ? (
        <Image
          className="hover:scale-150"
          src={threePlayersMissedPenaltyBadge}
          width={128}
          height={128}
          alt="Medalha de conquista porque escalou 3 ou mais jogadores que erraram pênaltis"
        />
      ) : null}
      {trophies['more-than-three-red-carded-players'] ? (
        <Image
          className="hover:scale-150"
          src={threePlayersRedCardedBadge}
          width={128}
          height={128}
          alt="Medalha de conquista porque escalou 3 ou mais jogadores que foram expulsos"
        />
      ) : null}
      {trophies['less-than-30-points-in-round'] ? (
        <Image
          className="hover:scale-150"
          src={bagreBadge}
          width={128}
          height={128}
          alt="Medalha de conquista porque fez menos que 30 pontos em alguma rodada"
        />
      ) : null}
    </div>
  )
}

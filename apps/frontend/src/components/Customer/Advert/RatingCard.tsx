import {IAdvertRatingsRating} from '@/types/advertWishlist'
import {newUserTimeZoneFormatDate} from '@/utils/fx'
import {Rate} from 'antd'
import Image from 'next/image'

interface IProps {
  rating: IAdvertRatingsRating
  average_rating: number
  total_ratings: number
}
const RatingCard = ({average_rating, total_ratings, rating}: IProps) => {
  return (
    <div className="flex items-start justify-between gap-2 rounded-[11px] border border-[#EAECEF] bg-white p-2 shadow-f1">
      <div className="flex items-start gap-2">
        <Image
          onError={error => {
            error.currentTarget.src = '/assets/rating-avatar.png'
          }}
          src={'/assets/rating-avatar.png'}
          alt="product image"
          width={45}
          height={45}
          className="h-[45px] w-[45px] rounded-lg object-cover"
        />
        <div className="flex flex-col justify-between gap-1">
          <h4 className="text-sm font-[500] capitalize">{rating?.name ?? 'Anonymous'}</h4>
          <Rate
            disabled={true}
            onChange={value => {}}
            value={average_rating}
            style={{
              fontSize: 15,
              color: '#FDBF5E' // Both size and color in style prop
            }}
          />
        </div>
      </div>
      <p className="text-[10px]">{newUserTimeZoneFormatDate(rating?.created_at, 'DD/MM/YYYY')}</p>
    </div>
  )
}

export default RatingCard

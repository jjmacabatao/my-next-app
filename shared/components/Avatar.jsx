import React from 'react'
import Image from 'next/image';
import { border, radius, shadow } from '../styles/globalN';

const Avatar = ( { avatarSrc, avatarAlt, avatarWidth, avatarHeight}) => {
  return (
    <section>
      <Image src={avatarSrc} width={avatarWidth} height={avatarHeight} alt={avatarAlt} className={`${radius.full} object-contain`}  />
      {/* <div class={`${radius.full} w-12 h-12 border bg-gray-100 p-2 text-center`}>
        <p class="text-lg font-bold">
          JJ
        </p>
      </div>   */}
    </section>
    
  )
}

export default Avatar
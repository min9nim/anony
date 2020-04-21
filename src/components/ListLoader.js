import React from 'react'
import ContentLoader from 'react-content-loader'
import { ctx } from '@/biz/context'

export class ListLoader extends React.Component {
  render() {
    return new Array(5).fill().map((v, i) => (
      <div className="excerpt" key={i}>
        <ContentLoader
          height={50}
          width={400}
          speed={2}
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
          {...this.props}
        >
          <rect x="300" y="3" rx="4" ry="4" width="100.5" height="10" />
          <rect x="2" y="21" rx="3" ry="3" width="399" height="7" />
          <rect x="2" y="31" rx="3" ry="3" width="399" height="7" />
          <rect x="2" y="41" rx="3" ry="3" width="100" height="7" />
        </ContentLoader>
      </div>
    ))
  }
}

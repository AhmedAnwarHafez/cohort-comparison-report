import request from 'superagent'
import path from 'path'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import { Response } from './types'

dotenv.config()
const url = 'https://api.github.com/graphql'
const pat = process.env.personal_acccess_token || ''

const makeQuery = (org: string, repo: string) => ({
  query: `{
  repository(name: "${repo}", owner: "${org}") {
    name
    createdAt
    refs(
      refPrefix: "refs/heads/"
      orderBy: {direction: DESC, field: TAG_COMMIT_DATE}
      first: 100
    ) {
      edges {
        node {
          name
          ... on Ref {
            name
            target {
              ... on Commit {
                history(first: 1) {
                  edges {
                    node {
                      ... on Commit {
                        committedDate
                        author {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`,
})

function fetchQuery(pat: string, query: { query: string }) {
  return request
    .post(url)
    .set('authorization', `Bearer ${pat}`)
    .set('User-Agent', 'how-long')
    .set('Content-Type', 'application/json')
    .send(query)
    .then((response) => response.body)
    .catch(() => console.log('opes'))
}

function toTable(response: Response, org: string) {
  return response.data.repository.refs.edges.flatMap((branch) => ({
    orgName: org,
    repoName: response.data.repository.name,
    createdAt: response.data.repository.createdAt,
    branchName: branch.node.name,
    commitDate: branch.node.target.history.edges[0].node.committedDate,
    author: branch.node.target.history.edges[0].node.author.name,
  }))
}

function main() {
  const orgs = [
    'matai-2022',
    'kahikatea-2022',
    'harakeke-2022',
    'horoeka-2021',
    'pohutukawa-2021',
    'pohutukawa-2022',
  ]

  const repos = [
    'pupparazzi',
    'dreamfest',
    'worldwide-routing',
    'react-to-web-api',
    'sweet-as-organics-api',
    'jwt-auth',
  ]

  const orgsResults = Promise.all(
    orgs.flatMap((org) =>
      repos.map((repo) =>
        fetchQuery(pat, makeQuery(org, repo)).then((data) => toTable(data, org))
      )
    )
  )

  orgsResults.then((orgs) => {
    const filePath = path.join(__dirname, '..', 'data', `data.json`)
    fs.writeFile(filePath, JSON.stringify(orgs.flat(), null, 2))
  })
}

main()

export interface LandingSection {
  sectionKey: string
  sectionName: string
  contentJson: string
  updatedAt: string
}

export interface LandingSectionContent {
  [key: string]: any
}

export const typeDefs = `#graphql
  scalar DateTime

  enum CapsuleStatus {
    DRAFT
    SEALED
    DELIVERED
  }

  type User {
    id: ID!
    email: String!
    name: String!
    avatar: String
    createdAt: DateTime
  }

  type Capsule {
    id: ID!
    title: String!
    description: String
    ownerId: ID!
    recipientName: String!
    recipientEmail: String
    shareToken: String!
    status: CapsuleStatus!
    deliveryDate: DateTime
    letters: [Letter!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Letter {
    id: ID!
    capsuleId: ID!
    authorId: ID!
    title: String
    content: String!
    mediaUrls: [String!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type MediaUpload {
    url: String!
    publicId: String!
  }

  type Query {
    me: User
    myCapsules: [Capsule!]!
    capsule(id: ID!): Capsule
    letter(id: ID!): Letter
    # Public query for QR/Share link
    unlockedCapsule(shareToken: String!): Capsule
  }

  input CreateCapsuleInput {
    title: String!
    description: String
    recipientName: String!
    recipientEmail: String
    deliveryDate: DateTime
  }

  input CreateLetterInput {
    capsuleId: ID!
    title: String
    content: String!
    mediaUrls: [String!]
  }

  type Mutation {
    createCapsule(input: CreateCapsuleInput!): Capsule!
    lockCapsule(id: ID!): Capsule!
    createLetter(input: CreateLetterInput!): Letter!
    uploadMedia(base64: String!, filename: String!): MediaUpload!
    generateLetterSuggestion(prompt: String!, tone: String): String!
    # Claim a capsule scanned via QR
    claimCapsule(shareToken: String!): Capsule!
  }
`;

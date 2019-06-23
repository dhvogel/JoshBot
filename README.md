# JoshBot

JoshBot is a bot which sits in a soccer team GroupMe and performs administrative tasks such as taking attendance and giving compliments.

## Data Models

### Game
```
{
  time: RFC 3339 Timestamp
  id: String (UUID)
  opponent: String
  location: String
  attendance: {
    yes: [String]
    no: [String]
    maybe: [String]
  }
}
```

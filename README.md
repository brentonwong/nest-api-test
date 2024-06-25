## Nest JS API

Playing around testing out Nest.JS for the first time.

## Assumptions

- No auth required
- No tables for agents or accounts
- Database columns are in snakecase but api using camelcase.

## API Structure Possible Changes

- Depending on data contracts, I would add another route to the Schedules controllers to get the Tasks for a specific Schedule. Something like `/schedules/:id/tasks` or possible adding them to the public data contract to return with the schedules but this may pose a performance issue down the track.
- Create additional public models that would be used to expose tasks and schedules instead of using the Prisma definitions.
- Depending on requirements the `PUT` endpoints could be removed in favour of using patch for only allowing updates of specific fields.
- Woudl move validation or utility functions to separate files under each module or possibly global/core if it was to be reused in multiple places.
- Move any errors thrown related to requests out of the services to made them "dumb" and not aware of nest and let the controllers handle anything related to requests or responses.

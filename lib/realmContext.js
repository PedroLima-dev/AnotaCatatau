// Shared Realm Context
// This file exports the RealmProvider and hooks that should be used throughout the app
import { createRealmContext } from '@realm/react';
import { realmConfig } from './realmConfig';

// Create a single Realm context that will be used by the entire app
const RealmContext = createRealmContext(realmConfig);

// Export the Provider and hooks from this context
export const { RealmProvider, useRealm, useQuery } = RealmContext;
export default RealmContext;

import {API, Auth, Hub} from 'aws-amplify';
import {UserType} from "./models";
import {createUser} from "./graphql/mutations";
import {getUser} from "./graphql/queries";

export const authHooks = () => {
    Hub.listen('auth', async (data) => {

        // Only pay attention to signIn events
        if (data.payload.event !== "signIn") return;

        // Query username in Users table
        const user = await Auth.currentAuthenticatedUser();
        const userData = await API.graphql({
            query: getUser,
            variables: { id: user.username }
        });

        // If user doesn't already exist in table, create it
        if(userData?.data.getUser) return;
        const userDetails = {
            id: user.username,
            name: user.attributes.name,
            email: user.attributes.email,
            wins: 0,
            losses: 0,
            type: UserType.PLAYER
        }
        API.graphql({query: createUser, variables: {input: userDetails}});
    });
}
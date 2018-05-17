import React, { StatelessComponent } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';
import { ChooseCreature } from './ChooseCreature';
import { DisplayCreature } from './DisplayCreature';

type ImplProps = RouteComponentProps<{ id: string }>;

const EncounterImpl: StatelessComponent<ImplProps> = ({ history }: ImplProps) => {
    return <Switch>
        <Route path="/creatures/:id" render={(match) =>
            <DisplayCreature onBack={() => history.push(`/`)} creatureId={match.match.params.id}/>}/>
        <Route path="/" children={
            <ChooseCreature onSelect={id => history.push(`/creatures/${id}`)}/>}/>
    </Switch>;
};

export const Encounter = withRouter(EncounterImpl);

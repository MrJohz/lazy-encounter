import bind from 'bind-decorator';
import { observer } from 'mobx-react';
import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router';

import { CreatureStore, Creature, CreatureGroup } from '../../models/creatures';
import { Match, Callback } from '../../utils/jsx-props';
import { ChooseCreature } from './ChooseCreature';
import { DisplayCreature } from './DisplayCreature';

type MatchProps = Match<{ group: string, creature: string }>
type Props = { store: CreatureStore } & RouteComponentProps<MatchProps>;

type RoutedDisplayCreatureProps
    = MatchProps
    & { getCreature: (group: string, creature: string) => Creature | null }
    & Callback<'onBack'>;

function RoutedDisplayCreature({ match, getCreature, onBack }: RoutedDisplayCreatureProps): JSX.Element {
    const creature = getCreature(match.params.group, match.params.creature);
    if (creature) {
        return <DisplayCreature creature={creature} onBack={onBack}/>;
    } else {
        return <div>ERROR!</div>;
    }
}

@observer
class EncounterImpl extends React.Component<Props> {

    private readonly getCreatures: (group: string, creature: string) => Creature | null;

    constructor(props: Props) {
        super(props);
        this.getCreatures = (group, creature) => this.props.store.getCreature(group, creature);
    }

    @bind
    toRoot() {
        this.redirect('/');
    }

    @bind
    toCreature(group: CreatureGroup, creature: Creature) {
        this.redirect(`/creature/${group.name}/${creature.name}`);
    }

    redirect(url: string) {
        this.props.history.push(url);
    }

    render() {
        return <Switch>
            <Route path="/creature/:group/:creature"
                   render={({ match }) =>
                       <RoutedDisplayCreature match={match} onBack={this.toRoot}
                                              getCreature={this.getCreatures}/>}/>
            <Route path="/" children={<ChooseCreature creatures={this.props.store.creatures}
                                                      onSelect={this.toCreature}/>}/>
        </Switch>;
    }
}

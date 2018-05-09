import { mount } from 'enzyme';
import { suite, test } from 'mocha-typescript';
import expect from 'must';
import React from 'react';
import { Shorty } from '../../../src/js/shorty';
import { TestAdaptor } from '../../../src/js/shorty/adaptors';
import { ShortyProvider, Shortcut } from '../../../src/js/shorty/react';
import { BrowserTestBase, toggler } from '../browser-utils.setup';

@suite('<ShortyProvider/>')
class ShortyProviderTest extends BrowserTestBase {

    @test 'it should render children'() {
        const adaptor = new TestAdaptor();
        const wrapper = mount(
            <ShortyProvider adaptor={adaptor}>
                <div id="child"/>
            </ShortyProvider>);

        expect(wrapper.find('#child').length).to.equal(1);
    }

    @test 'should create a shorty instance'() {
        const adaptor = new TestAdaptor();
        const wrapper = mount(
            <ShortyProvider adaptor={adaptor}>
                <div id="child"/>
            </ShortyProvider>);

        const component = wrapper.instance() as ShortyProvider;
        expect(component.shortyInstance()).to.be.instanceOf(Shorty);
        expect((component.shortyInstance() as Shorty)['adaptor']).to.equal(adaptor);
    }

}

@suite('<Shortcut />')
class ShortcutTest extends BrowserTestBase {
    @test 'it should render the child as normal if rendered outside a shorty context'() {
        const wrapper = mount(
            <Shortcut shortcut={'test'}>
                <div id={'child'}/>
            </Shortcut>);

        expect(wrapper.find('#child')).to.have.length(1);
    }

    @test 'it should add a shortcut to the Shorty instance provided'() {
        const adaptor = new TestAdaptor();
        const wrapper = mount(
            <ShortyProvider adaptor={adaptor}>
                <Shortcut shortcut={'test shortcut'}/>
            </ShortyProvider>);

        const shortyInstance = (wrapper.instance() as ShortyProvider).shortyInstance();
        if (shortyInstance === null) throw new Error('shorty instance is null');
        expect(shortyInstance.shortcutCount).to.equal(1);
    }

    @test 'it should remove shortcut when un-rendered'() {
        const adaptor = new TestAdaptor();
        const { toggle, Toggle } = toggler();

        const wrapper = mount(
            <ShortyProvider adaptor={adaptor}>
                <Toggle>
                    <Shortcut shortcut={'test shortcut'}/>
                </Toggle>
            </ShortyProvider>);

        const shortyInstance = (wrapper.instance() as ShortyProvider).shortyInstance();
        if (shortyInstance === null) throw new Error('shorty instance is null');
        expect(shortyInstance.shortcutCount).to.equal(1);

        toggle('hide');

        expect(shortyInstance.shortcutCount).to.equal(0);

        toggle('show');

        expect(shortyInstance.shortcutCount).to.equal(1);
    }
}

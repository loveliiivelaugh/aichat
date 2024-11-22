import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import Tabs from 'mf2/Tabs';

const meta = {
    title: 'Components/Tabs',
    component: Tabs,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        tabs: [
            {
                label: 'Tab 1',
                value: 'Tab 1',
            },
            {
                label: 'Tab 2',
                value: 'Tab 2',
            },
            {
                label: 'Tab 3',
                value: 'Tab 3',
            },
        ],
    },
};
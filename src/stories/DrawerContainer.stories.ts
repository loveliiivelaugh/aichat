import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import DrawerContainer from 'mf2/DrawerContainer';

const meta = {
    title: 'Components/DrawerContainer',
    component: DrawerContainer,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof DrawerContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        style: {
            width: '100%',
            height: '100%',
        },
    },
};
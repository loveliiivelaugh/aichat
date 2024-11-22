import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import BottomNavigation from 'mf2/BottomNavigation';

const meta = {
    title: 'Components/BottomNavigation',
    component: BottomNavigation,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
